angular.module("beansprouts_app")
.controller("adminController", ["$scope", "$http", function($scope, $http){

  $scope.options = [];

  $scope.student = {};
  $scope.teacher = {};
  $scope.class = {};
  $scope.student.name = "";
  $scope.teacher.password = "";
  $scope.class.name = "";
  $scope.class.type = "pre";

  $scope.studentData = [];
  $scope.teacherData = [];
  $scope.classData = []

  $scope.getClassList = function(){
    $http.get('/api/classes')
    .success(function(data){
      $scope.classData = data;
    });
  }

  $scope.getTeacherList = function(){
    $http.get('/api/teachers')
    .success(function(data){
      $scope.teacherData = data;
    });
  }

  $scope.getStudentList = function(){
    $http.get('/api/students?filter={\"order\":\"name ASC\"}')
    .success(function(data){
      $scope.studentData = data;
    });
  }

  $scope.addClass = function() {
    $http.post('/api/classes/', {name:$scope.class.name, class_type:$scope.class.type})
    .success(function(classObj){
      $scope.classData.push(classObj);
      $scope.class.name = "";
      $scope.class.type = "pre";
    });
  }

  $scope.addTeacher = function() {
    $http.post('/api/teachers/', {email:($scope.teacher.username+"@sproutsbk.com"), password:$scope.teacher.password, username:$scope.teacher.username, name:$scope.teacher.name})
    .success(function(teacher){
      $scope.teacherData.push(teacher);
      $scope.teacher.name = "";
      $scope.teacher.password = "";
      $scope.teacher.username = "";
    });
  }

  $scope.addStudent = function() {
    console.log($scope.student.name);
    $http.post('/api/students/', {name:$scope.student.name, pin:"1234", status:"checked out", last_action_date:new Date()})
    .success(function(student){
      $scope.getStudentList();
      $scope.student.name = "";
    });
  }

  $scope.deleteStudent = function(student){
    $http.delete('/api/students/'+student.id)
    .success(function(){
      $scope.getStudentList();
    });
  }

  $scope.deleteClass = function(classObj){
    $http.delete('/api/classes/'+classObj.id)
    .success(function(){
      $scope.getClassList();
    });
  }

  $scope.deleteTeacher = function(teacher){
    $http.delete('/api/teachers/'+teacher.id)
    .success(function(){
      $scope.getTeacherList();
    });
  }

  $scope.getClassList();
  $scope.getTeacherList();
  $scope.getStudentList();




}]);
