var controllers = angular.module('controllers', []);


controllers.controller("testController", ["$scope", "$http", function($scope, $http){

  $scope.options = [];
  $scope.text = "";

/*
  $scope.updateOptions = function() {
    if ($scope.text.length >= 2){
      $http.get("/api/students?filter={\"where\":{\"name\": {\"like\" : \"" + $scope.text + "\"}}}")
      .success(function(options){
        $scope.options = options;
      });
    } else {
      $scope.options = [];
    }
  }
*/
  $scope.getOptions = function() {
    return $http.get("/api/students?filter={\"where\":{\"name\": {\"like\" : \"" + $scope.text + "\"}}}")
    .then(function(response){
        return response.data;
    });
  };



}]);

controllers.controller("classListController", ["$scope", "$http", function($scope, $http){

  $scope.pre_classes = {};
  $scope.after_classes = {};
  $scope.pick_up_locs = {};

  $http.get("/api/classes?filter={\"where\":{\"class_type\":\"pre\"}}")
  .success(function(classes){
    $scope.pre_classes = classes;
  });

  $http.get("/api/classes?filter={\"where\":{\"class_type\":\"after\"}}")
  .success(function(classes){
    $scope.after_classes = classes;
  });

  $http.get("/api/classes?filter={\"where\":{\"class_type\":\"pickup\"}}")
  .success(function(classes){
    $scope.pick_up_locs = classes;
  });


}]);

controllers.controller("loginController", ["$scope", "$http", "$location", "$window", "$cookieStore", function($scope, $http, $location, $window, $cookieStore){
  $scope.adminCheckBox = false;

  $scope.logIn = function(email, password){
    $http.post('/api/teachers/login/', {email:$scope.email, password:$scope.password, ttl:60*10*1000})
    .success(function(data, status, headers, config) {
      $http.defaults.headers.common.authorization = data.id;
      $cookieStore.put("authToken", data.id);
      console.log("logged in");
      $location.path("classes");

    });
  }

  $scope.logInAdmin = function(email, password){
      $http.post('/api/admins/login/', {email:$scope.email, password:$scope.password, ttl:60*10*1000})
      .success(function(data, status, headers, config) {
      $http.defaults.headers.common.authorization = data.id;
      $cookieStore.put("authToken", data.id);
      console.log("logged in admin");
      $location.path("admin");

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
  $scope.class = "";

  $scope.getClass = function () {
    $http.get('/api/classes/'+$routeParams.id+'/')
    .success(function(classObj){
      $scope.class = classObj;
    });
  }

  $scope.getStudents = function (){
    $http.get('/api/classes/'+$routeParams.id+'/students')
    .success(function(students){
      $scope.students = students;
    });
  }

  $scope.newStudent = function() {
    $http.post('/api/classes/'+$routeParams.id+'/students', {name:$scope.name, status:"checked out", last_action_date:new Date()})
    .success(function(student){
      $scope.students.push(student);
      $scope.name = "";
      $('button').button('reset');
    });
  };

  $scope.checkIn = function(studentId) {
    var btn = $('.checkIn.'+studentId);
    btn.button('loading');
    $http.post('/api/students/checkin', {studentId:studentId, classId:$routeParams.id})
    .success(function(student){
      $scope.getStudents();
    });
  }

  $scope.checkOut = function(studentId) {
    var btn = $('.checkOut.'+studentId);
    btn.button('loading');
    $http.post('/api/students/checkout', {studentId:studentId})
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
  $scope.getClass();
}]);
