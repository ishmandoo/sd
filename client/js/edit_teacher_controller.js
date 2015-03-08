angular.module("beansprouts_app")
.controller("editTeacherController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams){

  $scope.teacher = {password1:"", password2:""};

  $scope.update = function(){
    var query = {email:$scope.teacher.email,name:$scope.teacher.name}
    if (($scope.teacher.password1.length > 5) && ($scope.teacher.password1 == $scope.teacher.password2)) {
      query.password = $scope.teacher.password1;
    }
    $http.put('/api/teachers/'+$routeParams.id, query)
    .success(function(classObj){
      $scope.classObj = classObj;
    });
  }

  //$scope.password


  $http.get('/api/teachers/'+$routeParams.id)
  .success(function(teacher){
    $scope.teacher = teacher;
    $scope.teacher.password1 = "";
    $scope.teacher.password2 = "";
  });

}]);
