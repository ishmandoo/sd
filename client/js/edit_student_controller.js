angular.module("beansprouts_app")
.controller("editStudentController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams){

  $scope.student = {};

  $scope.update = function(){
    var query = {name:$scope.student.name}
    $http.put('/api/students/'+$routeParams.id, query)
    .success(function(classObj){
      $scope.classObj = classObj;
    });
  }

  //$scope.password


  $http.get('/api/students/'+$routeParams.id)
  .success(function(student){
    $scope.student = student;
  });

}]);
