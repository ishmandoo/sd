angular.module("beansprouts_app")
.controller("editTeacherController", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location){


  $scope.teacher = {password1:"", password2:"", isAdmin: false};

  $scope.passwordValid = function() {
    if (($scope.teacher.password1.length > 3) && ($scope.teacher.password1 == $scope.teacher.password2)) {
      return true;
    } else {
      return false;
    }
  }

  $scope.updateTeacher = function(){
    var query = {email:$scope.teacher.email, name:$scope.teacher.name, username:$scope.teacher.username, pin:$scope.teacher.pin}
    $http.put('/api/teachers/'+$routeParams.id, query)
    .success(function(teacher){
      $scope.teacher = teacher;
      $scope.teacher.password1 = "";
      $scope.teacher.password2 = "";
      $location.path("admin");
    });
  }

  $scope.updatePassword = function(){
    var query = {password:$scope.teacher.password1}
    $http.put('/api/teachers/'+$routeParams.id, query)
    .success(function(teacher){
      $scope.teacher = teacher;
      $scope.teacher.password1 = "";
      $scope.teacher.password2 = "";
      $location.path("admin");
    });
  }

  $scope.getTeacher = function() {

    $http.get('/api/teachers/'+$routeParams.id)
    .success(function(teacher){
      temp = $scope.teacher.isAdmin
      $scope.teacher = teacher;
      $scope.teacher.password1 = "";
      $scope.teacher.password2 = "";
      $scope.teacher.password2 = "";
      $scope.teacher.isAdmin = temp
    });


  }

  $scope.changeAdmin = function() {
    if($scope.teacher.isAdmin == true){
     route = 'addadmin'
   }
   else{
     route = 'removeadmin'
   }

    $http.post('/api/teachers/' + route, {teacherId: $scope.teacher.id})
    .success(function(response){
      $scope.getTeacher();
    });

  }

  $scope.getTeacher();



}]);
