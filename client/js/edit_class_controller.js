angular.module("beansprouts_app")
.controller("editClassController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams){

  $scope.classObj = {};
  $scope.studentList = [];

  $scope.newStudent = {name:""};

  $scope.update = function(){
    if($routeParams.id){
      $http.put('/api/classes/'+$routeParams.id, {name:$scope.classObj.name, class_type: $scope.classObj.class_type})
      .success(function(classObj){
        $scope.classObj = classObj;
      });
    }
  }

  $scope.addStudent = function(){
    if($routeParams.id){
      $http.put('/api/classes/'+$routeParams.id+'/students/rel/'+$scope.autoCompleteStudents[0].id)
      .success(function(student){
        $scope.getStudentList();
        $scope.newStudent.name = "";
      });
    }
  }

  $scope.removeStudent = function(student){
    if($routeParams.id){
      $http.delete('/api/classes/'+$routeParams.id+'/students/rel/'+student.id)
      .success(function(student){
        $scope.getStudentList();
      });
    }
  }

  $scope.getAutoCompleteStudents = function() {
    return $http.get("/api/students?filter={\"where\":{\"name\": {\"like\" : \"" + $scope.newStudent.name + "\",\"options\": \"i\"}}}")
    .then(function(response){
      $scope.autoCompleteStudents = response.data;
      return response.data;
    });
  };

  $scope.getStudentList = function() {
    $http.get('/api/classes/'+$routeParams.id+'/students')
    .success(function(studentList){
      $scope.studentList = studentList;
    });
  }

  $http.get('/api/classes/'+$routeParams.id)
  .success(function(classObj){
    $scope.classObj = classObj;
  });

  $scope.getStudentList();


}]);
