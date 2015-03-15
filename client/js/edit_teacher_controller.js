angular.module("beansprouts_app")
.controller("editTeacherController", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location){

  $scope.teacher = {password1:"", password2:""};

  $scope.update = function(){
    var query = {email:$scope.teacher.email,name:$scope.teacher.name,username:$scope.teacher.username}
    if (passwordValid()) {
      query.password = $scope.teacher.password1;
    }
    $http.put('/api/teachers/'+$routeParams.id, query)
    .success(function(teacher){
      $scope.teacher = teacher;
      $location.path("admin");
    });
  }

  //$scope.password


  $http.get('/api/teachers/'+$routeParams.id)
  .success(function(teacher){
    $scope.teacher = teacher;
    $scope.teacher.password1 = "";
    $scope.teacher.password2 = "";
  });

  $scope.passwordValid = function() {
    if (($scope.teacher.password1.length > 5) && ($scope.teacher.password1 == $scope.teacher.password2)) {
      return true;
    } else {
      return false;
    }
  }

}]);
