angular.module("beansprouts_app")
.controller("adminController", ["$scope", "$http", "confirmDeletionService", function($scope, $http, confirmDeletionService){

  $scope.options = [];

  $scope.tabs = {admin:true, timeBlocks:false};

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
    $http.get("/api/teachers?filter={\"include\":{\"relation\":\"roleMappings\"}}")
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
    $http.post('/api/teachers/', {email:($scope.teacher.username+"@sproutsbk.com"),  pin:"4567", password:$scope.teacher.password, username:$scope.teacher.username, name:$scope.teacher.name})
    .success(function(teacher){
      $scope.teacherData.push(teacher);
      $scope.teacher.name = "";
      $scope.teacher.password = "";
      $scope.teacher.username = "";
    });
  }

  $scope.addStudent = function() {
    console.log($scope.student.name);
    $http.post('/api/students/', {name:$scope.student.name, status:"checked out", last_action_date:new Date()})
    .success(function(student){
      $scope.getStudentList();
      $scope.student.name = "";
    });
  }

  $scope.deleteStudent = function(student){
    confirmDeletionService.confirmDeletion()
    .then(function () {
      $http.delete('/api/students/'+student.id)
      .success(function(){
        $scope.getStudentList();
      });
    });
  }

  $scope.deleteClass = function(classObj){
    confirmDeletionService.confirmDeletion()
    .then(function () {
      $http.delete('/api/classes/'+classObj.id)
      .success(function(){
        $scope.getClassList();
      });
    });
  }

  $scope.deleteTeacher = function(teacher){
    confirmDeletionService.confirmDeletion()
    .then(function () {
      $http.delete('/api/teachers/'+teacher.id)
      .success(function(){
        $scope.getTeacherList();
      });
    });
  }

  $scope.getClassList();
  $scope.getTeacherList();
  $scope.getStudentList();




}]).directive('addRemove', function() {
  return {
    controller: 'listController',
    restrict: 'E',
    scope: {
      type: "=type"
    },
    templateUrl: '../html/list.html'
  };
}).controller("listController", ["$scope", "$http", "confirmDeletionService", function($scope, $http, confirmDeletionService){

  $scope.newItemName = "";
  $scope.data = [];
  $scope.name = "";
  $scope.detail_path = "";

  if ($scope.type == "classes") {
    $scope.name = "Classes";
    $scope.detail_path = "class"
  } else if ($scope.type == "students") {
    $scope.name = "Students";
    $scope.detail_path = "student"
  }

  $scope.getList = function(){
    $http.get('/api/'+ $scope.type +'?filter={\"order\":\"name ASC\"}')
    .success(function(data){
      $scope.data = data;
    });
  }

  $scope.add = function() {
    var attrs = {};
    if ($scope.type == "students") {
      attrs = {name:$scope.newItemName, status:"checked out", last_action_date:new Date()}
    } else if ($scope.type == "classes") {
      attrs = {name:$scope.newItemName, class_type:"pre"}
    }

    console.log($scope.newItemName);
    $http.post('/api/'+ $scope.type +'/', attrs)
    .success(function(item){
      $scope.getList();
      $scope.newItemName = "";
    });
  }

  $scope.delete = function(item){
    confirmDeletionService.confirmDeletion()
    .then(function () {
      $http.delete('/api/'+ $scope.type +'/'+item.id)
      .success(function(){
        $scope.getList();
      });
    });
  }

  $scope.selectTab = function(tab) {
    $scope.selectedTab = tab;
  }

  $scope.getList();
}]);
