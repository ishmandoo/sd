var app = angular.module("test_app", ['ngKeypad']);

mycount = 0

app.controller("testController", ["$scope", "$http", function($scope,$http){
  $scope.pin ="000"

  $scope.listenedString = "";

		$scope.$on(Keypad.KEY_PRESSED, function(event,data){
			$scope.listenedString += data;
			$scope.$digest();
		});



}])
