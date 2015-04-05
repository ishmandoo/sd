angular.module("beansprouts_app")
.controller("studentListController", ["$scope", "$http", "$routeParams", "dateFilterObjectService", function($scope, $http, $routeParams, dateFilterObjectService){

  $scope.seatList = [];
  $scope.name = "";
  $scope.class = "";
  $scope.teacher = {};

  $scope.modal = false;

  $scope.pinpad = {};
  $scope.pin ="";
  $scope.pinNumbers = ["1","2","3","4","5","6","7","8","9"];
  $scope.teacherToggle = false;

  $scope.firstPin = "";

  $scope.teacherPinTime = new Date(0);


  $scope.overrideTimeout = 0;
  $scope.overrideTimer = null;

  console.log(dateFilterObjectService.getDateFilterObject());


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
      if (!$scope.teacherToggle && $scope.pin == $scope.pinpad.seat.student.pin) {
        $scope.pinpad.callback($scope.pinpad.seat.id);
      } else if ($scope.teacherToggle && $scope.pin == $scope.teacher.pin) {
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
      } else if (!$scope.teacherToggle && !$scope.pinpad.seat.student.pin) {
        if ($scope.firstPin == "") {
          $scope.firstPin = $scope.pin;
          $scope.pin = "";
          $('.modal-title').html("Please Repeat PIN");
        } else if ($scope.pin == $scope.firstPin) {
          $scope.setPin($scope.pinpad.seat.student, $scope.pin);
          $scope.pinpad.callback($scope.pinpad.seat.id);
        } else if ($scope.pin != $scope.firstPin) {
          $(".modal-content").shake(3,7,350);
          $('.modal-title').html("Please Choose a PIN");
          $scope.firstPin = "";
          $scope.pin = "";
        }
      } else {
        $(".modal-content").shake(3,7,350);
      }
      $scope.pin="";
    }
  }


  $scope.setPin = function(student, pin) {
    var query = {pin:pin};
    $http.put('/api/students/'+student.id, query)
    .success(function(classObj){
      $scope.getSeats();
    });
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
    $scope.firstPin = "";
    $scope.teacherToggle = false;
    $scope.pinpad.seat = seat
    $scope.pinpad.callback = callback
    now = new Date()
    if($scope.overrideTimeout <= 0){
      if (!seat.student.pin) {
        $('.modal-title').html("Please Choose a PIN");
      } else {
        $('.modal-title').html("Please Enter PIN");
      }
      $(".pin-modal").modal('show');
    } else {
      $scope.overrideTimeout = 100;
      $scope.pinpad.callback($scope.pinpad.seat.id);
    }

  }

  $scope.getClass = function () {
    $http.get('/api/classes/'+$routeParams.id+'/')
    .success(function(classObj){
      $scope.class = classObj;
      $scope.getSeats();
      $scope.getTeacher();
    });
  }

  $scope.getTeacher = function () {
    $http.get('/api/teachers/current')
    .success(function(response){
      $scope.teacher = response.teacher;
    });
  }


  $scope.getSeats = function (){

    $http({
      url: '/api/seats/getseatlist',
      method: "GET",
      params: {
        classId:$routeParams.id,
        dayOfWeekFilterObject: dateFilterObjectService.getDateFilterObject()
      }
    })
    .success(function(result){
      console.log(result);
      $scope.seatList = result.afterList;
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


$scope.getClass();
}]);