angular.module("beansprouts_app")
.controller("studentListController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams){

  $scope.seatList = [];
  $scope.name = "";
  $scope.class = "";
  $scope.teacher = {};

  $scope.modal = false;

  $scope.pinpad = {};
  $scope.pin ="";
  $scope.pinNumbers = ["1","2","3","4","5","6","7","8","9"];
  $scope.teacherToggle = false;

  $scope.teacherPinTime = new Date(0);

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

  $scope.overrideTimeout = 0;
  $scope.overrideTimer = null;


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
      if(!$scope.teacherToggle && $scope.pin == $scope.pinpad.seat.student.pin){
        $scope.pinpad.callback($scope.pinpad.seat.id);
      }
      else if($scope.teacherToggle && $scope.pin == $scope.teacher.pin){
        $scope.overrideTimeout = 100;

        $scope.overrideTimer = setInterval(function (){
          console.log($scope.overrideTimeout);
          $scope.overrideTimeout -= 2;
          if($scope.overrideTimeout <= 0) {
            clearInterval($scope.overrideTimer);
          }
          $scope.$digest();
        }, 100);

        $scope.pinpad.callback($scope.pinpad.seat.id);
      }
      else{
        $(".modal-content").shake(3,7,350);
      }
      $scope.pin="";
    }
  }

  //The is Some ngKeypad Stuff
  $scope.$on(Keypad.KEY_PRESSED, function(event,data){
    $scope.pinButton(data);
    $scope.$digest();
  });

  $scope.$on(Keypad.MODIFIER_KEY_PRESSED, function(event,key,id){

    switch(key){
      case "teacher":
        $scope.teacherToggle = !$scope.teacherToggle;
        break;
        case "back":
          $scope.pin = $scope.pin.slice(0,-1);
          break;
        }
        $scope.$digest();
      });


      $scope.startPinPad = function(seat, callback){
        $scope.pin="";
        $scope.teacherToggle = false;
        $scope.pinpad.seat = seat
        $scope.pinpad.callback = callback
        now = new Date()
        if($scope.overrideTimeout <= 0){
          $(".pin-modal").modal('show');
        }
        else{
          $scope.overrideTimeout = 100;
          $scope.pinpad.callback($scope.pinpad.seat.id);
        }

      }

      $scope.getClass = function () {
        $http.get('/api/classes/'+$routeParams.id+'/')
        .success(function(classObj){
          $scope.class = classObj;
        });
      }

      $scope.getTeacher = function () {
        $http.get('/api/teachers/current')
        .success(function(response){
          $scope.teacher = response.teacher;
        });
      }

      $scope.getSeats = function (){
        var day_of_week_where_obj = {}

        dayOfWeek = 'monday'; //TEMPORARY CHANGE TO MAKE MONDAY STUDENT LISTS APPEAR

        day_of_week_where_obj["days_of_week." + dayOfWeek] = true;

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
          $scope.seatList=[];
          if ($scope.class.class_type == "pickup"){
            $scope.buildPickupSeatList(seatList);
          } else {
            $scope.seatList = seatList;
          }
        });
      }

      $scope.buildPickupSeatList = function(seatList){
        var day_of_week_where_obj = {}
        day_of_week_where_obj["days_of_week." + dayOfWeek] = true;

        for (var i = 0; i < seatList.length; i++){
          $http({
            url: '/api/seats/',
            method: "GET",
            params: {
              filter:{
                where:{ and:[{studentId:seatList[i].student.id},day_of_week_where_obj] },
                include:[{relation:'class'},{relation:'student'}]
              }
            }
          })
          .success(function(pickupSeatList){
            for (var j=0; j < pickupSeatList.length; j++){
              if (pickupSeatList[j].class.class_type == "after"){
                console.log(pickupSeatList[j]);
                $scope.seatList.push(pickupSeatList[j]);
              }
            }
          });
        }
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
      $scope.getTeacher();
    }]);
