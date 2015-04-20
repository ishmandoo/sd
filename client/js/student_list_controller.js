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

  $scope.newPin = false;

  $scope.firstPin = "";
  $scope.pinPadTitle = "Please Enter PIN";

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
          $scope.pinPadTitle = "Repeat PIN";
        } else if ($scope.pin == $scope.firstPin) {
          $scope.setPin($scope.pinpad.seat.student, $scope.pin);
          $scope.pinpad.callback($scope.pinpad.seat.id);
        } else if ($scope.pin != $scope.firstPin) {
          $(".modal-content").shake(3,7,350);
          $scope.pinPadTitle = "Set New PIN";
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
    $scope.hidePopover();
    $scope.pinButton(data);
    $scope.$digest();
    //$(".pinbtn").trigger('mouseleave');
    $(".modal-title").focus();
  });

  $scope.$on(Keypad.MODIFIER_KEY_PRESSED, function(event,key,id){
    $scope.hidePopover();
    switch(key){
      case "teacher":
        $scope.teacherToggle = !$scope.teacherToggle;
        if($scope.teacherToggle){
          $scope.teacherTogglePinTitle = $scope.pinPadTitle;
          $scope.pinPadTitle = "Enter Teacher PIN";
        }
        else{
          $scope.pinPadTitle = $scope.teacherTogglePinTitle;
        }
      break;
      case "back":
        $scope.pin = $scope.pin.slice(0,-1);
      break;
    }
    $scope.$digest();
    $(".modal-title").focus();

  });


  $scope.setupPopover = function(){
    $('#popover-location').popover({
      delay:{"hide":0},
      content:"<center> <h1>Welcome!</h1><img src='res/sheepdog.png' width='50px'><h3>This student has no PIN yet.</h3><h4>Choose one, then repeat it.</h4></center>",
      html: true,
      placement:"bottom",
      trigger:""
    });
  }

  $scope.startPinPad = function(seat, callback){
    $scope.pin="";
    $scope.firstPin = "";
    $scope.newPin = false;
    $scope.teacherToggle = false;
    $scope.pinpad.seat = seat
    $scope.pinpad.callback = callback
    now = new Date()
    if($scope.overrideTimeout <= 0){
      $(".pin-modal").modal('show');
      if (!seat.student.pin) {
        $scope.pinPadTitle = "Set New PIN";



        setTimeout(function(){

          $('#popover-location').popover('show');
          /*setTimeout(function(){
            $('#popover-location').popover('hide');
          },3000);
*/
        },200);

        $scope.newPin = true;
      } else {
        $scope.pinPadTitle = "Please Enter PIN";
      }
    } else {
      $scope.overrideTimeout = 100;
      $scope.pinpad.callback($scope.pinpad.seat.id);
    }

  }

  $scope.hidePopover = function(){
    $('#popover-location').popover('hide');
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
      $scope.getNotes();
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

  $scope.getLastName = function(seat) {
    var names = seat.student.name.split(' ');
    return names[names.length-1].toLowerCase();

  }


  $scope.getNotes = function(){
    var today = new Date();
    today.setHours(0,0,0,0);
    tomorrow = new Date();
    tomorrow.setHours(0,0,0,0);
    tomorrow.setDate(today.getDate()+1);


    $http({
      url: '/api/notes/',
      method: "GET",
      params:{
        filter:{
          where:{
            and : [{date:{gt:today}}, {date:{lt:tomorrow}}]
          },
          //include:[{relation:'teacher'},{relation:'class'},{relation:'student'}],
          order:'date ASC',
          limit:10
        }
      }
    })
    .success(function(notes){
      //notes.startDate = $scope.noteList.startDate
      //notes.endDate = $scope.noteList.endDate;
      console.log(notes);
      $scope.noteList = notes;
      for(i=0; i < notes.length; i++){
        for(j=0; j < $scope.seatList.length; j++){
          if(notes[i].studentId == $scope.seatList[j].studentId){
            if( $scope.seatList[j].notes){
              $scope.seatList[j].notes.push(notes[i]);
            }
            else{
              $scope.seatList[j].notes = [ notes[i] ];
            }
          }
        }
      }
      console.log($scope.seatList)
    });


  }


$scope.setupPopover();
$scope.getClass();
}]);

function fix()
{
    var el = this;
    var par = el.parentNode;
    var next = el.nextSibling;
    par.removeChild(el);
    setTimeout(function() {par.insertBefore(el, next);}, 0)
}
