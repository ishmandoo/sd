var controllers = angular.module('controllers', []);

controllers.controller("classListController", ["$scope", "$http", function($scope, $http){

  $scope.classes = {};

  $http.get('/api/classes')
  .success(function(classes){
    $scope.classes = classes;
  });
}]);

controllers.controller("loginController", ["$scope", "$http", "$location", "$window", "$cookieStore", function($scope, $http, $location, $window, $cookieStore){
  $scope.logIn = function(email, password){
    $http.post('/api/teachers/login/', {email:$scope.email, password:$scope.password, ttl:60*10*1000})
    .success(function(data, status, headers, config)
    {
      $http.defaults.headers.common.authorization = data.id;
      $cookieStore.put("authToken", data.id);
      console.log("logged in");
      $location.path("classes");

    });
  }

  $scope.register = function(email, password){
    $http.post('/api/teachers/', {email:$scope.email, password:$scope.password})
    .success(function(data, status, headers, config)
    {
      $window.sessionStorage.token = data.token;
      console.log("registered")
      $location.path("classes")
    });
  }
}]);

controllers.controller("studentListController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams){


  $scope.students = {};
  $scope.name = "";

  $scope.getStudents = function (){
    $http.get('/api/classes/'+$routeParams.id+'/students')
    .success(function(students){
      $scope.students = students;
    });
  }

  $scope.newStudent = function() {
    console.log($scope.name);
    $http.post('/api/classes/'+$routeParams.id+'/students', {name:$scope.name, status:"checked out", last_action_date:new Date()})
    .success(function(student){
      $scope.students.push(student);
      $scope.name = "";
    });
  };

  $scope.checkInPre = function(studentId) {
    $http.post('/api/students/checkinpre', {studentId:studentId})
    .success(function(student){
      $scope.getStudents();
    });
  }

  $scope.checkInAfter = function(studentId) {
    $http.post('/api/students/checkinafter', {studentId:studentId})
    .success(function(student){
      $scope.getStudents();
    });
  }

  $scope.checkOut = function(studentId) {
    $http.post('/api/students/checkOut', {studentId:studentId})
    .success(function(student){
      $scope.getStudents();
    });
  }

  $scope.getStatus = function(student) {
    if (student.status == "checked out"){
      return "Checked Out";
    } else if (student.status == "checked in pre"){
      return "Checked In Preschool";
    } else if (student.status == "checked in after"){
      return "Checked In After School";
    } else {
      return "";
    }
  }

  $scope.getStudents();
}]);