angular.module("beansprouts_app")
.controller("editStudentController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams){

  $scope.student = {};
  $scope.logList = [];

  $scope.update = function(){
    var query = {name:$scope.student.name}
    $http.put('/api/students/'+$routeParams.id, query)
    .success(function(classObj){
      $scope.classObj = classObj;
    });
  }


  $http.get('/api/students/'+$routeParams.id)
  .success(function(student){
    $scope.student = student;
  });


  $http({
    url: '/api/logs/',
    method: "GET",
    params: {filter:
      {where:{studentId:$routeParams.id},
      order:'date DESC',
      limit:10}
      }


  })
  .success(function(logs){
    $scope.logList = logs;
  });


  $scope.getTeacherName = function(teacherId){
    $http({
      url: '/api/teachers/',
      method: "GET",
      params: {filter:{where:{studentId:$routeParams.id}}}
    })
    .success(function(logList){
      $scope.logList = logList;
      console.log(logList);
    });
  };


}]);
