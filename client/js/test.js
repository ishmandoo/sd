var app = angular.module("test_app", ['ngRoute',
                              'ngCookies', 'ui.bootstrap']);

mycount = 0

app.controller("testController", ["$scope", "$http", function($scope,$http){

  $scope.students = {};



  $scope.name = "";
  $scope.class = "";
  $scope.pinpad = {};
  $scope.pin="";
 $scope.goodpin = false;
 $scope.count = 0;


  $scope.craig = {pin: "1234"};
  $scope.modal = false;
  $scope.pinpad.student = $scope.craig;

  $scope.pin ="";
  $scope.pinNumbers = ["1","2","3","4","5","6","7","8","9","0"];




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

  $scope.pinButton = function(number) {
    console.log(number);
    console.log("BUDDO");
    $scope.pin = $scope.pin.concat(number);
    if ($scope.pin.length >= 4) {
      if($scope.pin == $scope.pinpad.student.pin){
        //$scope.pinpad.callback($scope.pinpad.student.id);
        console.log("correct pin");
        $(".pin-modal").modal('hide');
        $scope.goodpin = true;
      }
      else{
        $(".modal-content").shake(3,7,350);
        $scope.goodpin = false;
      }
      $scope.pin="";
    }
  }

/*  $( document ).on( "vclick", ".pinbutton", function() {
    //console.log("yo")
    //mycount++;
    //$("#mynum").html( mycount);
    //document.getElementById('mynum').innerHTML= mycount;
    //console.log(this);
    //console.log(this.scope());
    //var scope = angular.element('.pinbutton').scope()
    //scope.$apply(function(){scope.pinButton(this.value)});
    $scope.pinButton(this.value);
  }); */

  $scope.startPinPad = function(student, callback){
    $scope.pin="";
    $scope.pinpad.student = student
    $scope.pinpad.callback = callback
    $(".pin-modal").modal('show');
  }

  $scope.checkIn = function(){
    return 0;

  }

$scope.inc = function(){

  $scope.count++;

}
$scope.incbare = function(){

  mycount++;
  console.log(mycount);
  document.getElementById('mynum').innerHTML= mycount;

}


}])
