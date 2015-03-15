var controllers = angular.module('controllers', []);


controllers.controller("testController", ["$scope", "$http", function($scope, $http){

  $scope.options = [];
  $scope.text = "";

/*
  $scope.updateOptions = function() {
    if ($scope.text.length >= 2){
      $http.get("/api/students?filter={\"where\":{\"name\": {\"like\" : \"" + $scope.text + "\"}}}")
      .success(function(options){
        $scope.options = options;
      });
    } else {
      $scope.options = [];
    }
  }
*/
  $scope.getOptions = function() {
    return $http.get("/api/students?filter={\"where\":{\"name\": {\"like\" : \"" + $scope.text + "\"}}}")
    .then(function(response){
        return response.data;
    });
  };



}]);

controllers.controller("classListController", ["$scope", "$http", function($scope, $http){

  $scope.pre_classes = [];
  $scope.after_classes = [];
  $scope.pick_up_locs = [];

  var weekday = new Array(7);
  weekday[0]=  "sunday";
  weekday[1] = "monday";
  weekday[2] = "tuesday";
  weekday[3] = "wednesday";
  weekday[4] = "thursday";
  weekday[5] = "friday";
  weekday[6] = "saturday";
  var today = new Date();
  var dayOfWeek = weekday[today.getDay()];


  $scope.getAttendanceFraction = function(classList){
    var day_of_week_where_obj = {}
    day_of_week_where_obj["days_of_week.monday"] = true;


    console.log(classList);

    for (var i = 0; i < classList.length; i++){

      (function(index){
        $http({
          url: '/api/seats/count',
          method: "GET",
          params: {
            where:{ and:[{classId:classList[index].id},day_of_week_where_obj] }
          }
        })
        .success(function(res){
            classList[index].totalStudents = res.count;

        });

        $http({
          url: '/api/seats/count',
          method: "GET",
          params: {
            where:{ and:[{classId:classList[index].id}, {checked_in:true}, day_of_week_where_obj] }
          }
        })
        .success(function(res){
          (function(i){
            classList[index].totalCheckedIn = res.count;
          }(i))
        });


      })(i)
    }
  }

  $http.get("/api/classes?filter={\"where\":{\"class_type\":\"pre\"}}")
  .success(function(classes){
    $scope.pre_classes = classes;
    $scope.getAttendanceFraction($scope.pre_classes);
  });

  $http.get("/api/classes?filter={\"where\":{\"class_type\":\"after\"}}")
  .success(function(classes){
    $scope.after_classes = classes;
    $scope.getAttendanceFraction($scope.after_classes);
  });

  $http.get("/api/classes?filter={\"where\":{\"class_type\":\"pickup\"}}")
  .success(function(classes){
    $scope.pick_up_locs = classes;
    $scope.getAttendanceFraction($scope.pick_up_locs);
  });

}]);

controllers.controller("loginController", ["$scope", "$http", "$location", "$window", "$cookieStore", function($scope, $http, $location, $window, $cookieStore){
  $scope.loginFailed = false;

  $scope.logIn = function(username, password){
    $http.post('/api/teachers/login/', {username:$scope.username, password:$scope.password, ttl:60*10*1000}).
    success(function(data, status, headers, config) {
      $http.defaults.headers.common.authorization = data.id;
      $cookieStore.put("authToken", data.id);
      console.log("logged in");
      $location.path("classes");
    }).
    error(function(data, status, headers, config){
      $scope.loginFailed = true;
    });

  }

  $scope.logInAdmin = function(username, password){
      $http.post('/api/admins/login/', {username:$scope.username, password:$scope.password, ttl:60*10*1000})
      .success(function(data, status, headers, config) {
      $http.defaults.headers.common.authorization = data.id;
      $cookieStore.put("authToken", data.id);
      console.log("logged in admin");
      $location.path("admin");

    })
    .error(function(data, status, headers, config){
      $scope.loginFailed = true;
    });
  }

  $scope.register = function(username, password){
    $http.post('/api/teachers/', {username:$scope.username, password:$scope.password})
    .success(function(data, status, headers, config)
    {
      $window.sessionStorage.token = data.token;
      console.log("registered")
      $location.path("classes")
    });
  }
}]);

controllers.controller("studentListController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams){

  $scope.seatList = {};
  $scope.name = "";
  $scope.class = "";
  $scope.pinpad = {};

  $scope.modal = false;

  $scope.pin ="";
  $scope.pinNumbers = ["1","2","3","4","5","6","7","8","9","0"];

  var weekday = new Array(7);
  weekday[0]=  "sunday";
  weekday[1] = "monday";
  weekday[2] = "tuesday";
  weekday[3] = "wednesday";
  weekday[4] = "thursday";
  weekday[5] = "friday";
  weekday[6] = "saturday";
  var today = new Date();
  var dayOfWeek = weekday[today.getDay()];


  jQuery.fn.shake = function(intShakes, intDistance, intDuration) {
    this.each(function() {
      //$(this).css("position","relative");
      for (var x=1; x<=intShakes; x++) {
        $(this).animate({left:(intDistance*-1)}, (((intDuration/intShakes)/4)))
        .animate({left:intDistance}, ((intDuration/intShakes)/2))
        .animate({left:0}, (((intDuration/intShakes)/4)));
      }
    });
    return this;
  };

  $scope.pinButton = function(number, pin) {
    $scope.pin = $scope.pin.concat(number);
    if ($scope.pin.length >= 4) {
      if($scope.pin == $scope.pinpad.seat.student.pin){
        $scope.pinpad.callback($scope.pinpad.seat.id);
      }
      else{
        $(".modal-content").shake(3,7,350);
      }
      $scope.pin="";
    }
  }

  $scope.startPinPad = function(seat, callback){
    $scope.pin="";
    $scope.pinpad.seat = seat
    $scope.pinpad.callback = callback
    $(".pin-modal").modal('show');

  }

  $scope.getClass = function () {
    $http.get('/api/classes/'+$routeParams.id+'/')
    .success(function(classObj){
      $scope.class = classObj;
    });
  }

  $scope.getSeats = function (){
    var day_of_week_where_obj = {}
    day_of_week_where_obj["days_of_week.monday"] = true;

    $http({
      url: '/api/seats/',
      method: "GET",
      params: {
        filter:{
          where:{ and:[{classId:$routeParams.id},day_of_week_where_obj] },
          include:{relation:'student'}
        }
      }
    })
    .success(function(seatList){
      $scope.seatList = seatList;
    });
  }

  $scope.checkIn = function(seatId) {
    var btn = $('.checkIn.'+seatId);
    btn.button('loading');
    $http.post('/api/seats/checkin', {seatId:seatId})
    .success(function(){
      $scope.getSeats();
      $(".pin-modal").modal('hide');
    });
  }

  $scope.checkOut = function(seatId) {
    var btn = $('.checkOut.'+seatId);
    btn.button('loading');
    $http.post('/api/seats/checkout', {seatId:seatId})
    .success(function(){
      $scope.getSeats();
      $(".pin-modal").modal('hide');

    });
  }

  $scope.getStatus = function(checked_in) {
    if (checked_in){
      return "Checked In";
    } else {
      return "Checked Out";
    }
  }

  $scope.getSeats();
  $scope.getClass();
}]);
