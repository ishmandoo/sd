angular.module("beansprouts_app")
.controller("editTeacherController", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location){


  $scope.teacher = {password1:"", password2:"", isAdmin: false, wasAdmin: false};

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
      $scope.teacher.original_name = teacher.name;
      $scope.teacher.password1 = "";
      $scope.teacher.password2 = "";
      $location.path("admin");
    });


    if ($scope.teacher.isAdmin != $scope.teacher.wasAdmin) {
      if ($scope.userId != $scope.teacher.id) {
        $scope.changeAdmin();
      } else {
        alert("You may not change your own admin status");
      }
    }
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

    $http.get('/api/teachers/'+$routeParams.id+"?filter={\"include\":{\"relation\":\"roleMappings\"}}")
    .success(function(teacher){

      $scope.teacher = teacher;
      $scope.teacher.password1 = "";
      $scope.teacher.password2 = "";
      $scope.teacher.password2 = "";
      console.log(teacher)

      if((teacher.roleMappings.length >= 1) && (teacher.roleMappings[0].roleId == 1)){
        $scope.teacher.isAdmin = true;
        $scope.teacher.wasAdmin = true;
      } else {
        $scope.teacher.isAdmin = false;
        $scope.teacher.wasAdmin = false;
      }
    });


  }

  $scope.changeAdmin = function() {
    if($scope.teacher.isAdmin == true){
      route = 'addadmin'
    } else {
      route = 'removeadmin'
    }

    $http.post('/api/teachers/' + route, {teacherId: $scope.teacher.id})
    .success(function(response){
    });

  }

  $scope.getTeacher();

  $http.get('/api/teachers/current')
  .success(function(response){
    console.log(response);
    $scope.userId = response.teacher.id;
  });

  $http.get('/api/teachers/currentisadmin')
  .success(function(response){
    console.log(response);
  });

}]);
