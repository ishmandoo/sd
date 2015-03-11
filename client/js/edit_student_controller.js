angular.module("beansprouts_app")
.controller("editStudentController", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location){

  $scope.student = {};
  $scope.logList = [];
  $scope.startDate = new Date("1/1/2015");
  $scope.endDate = new Date("4/1/2015");

  $scope.update = function(){
    var query = {name:$scope.student.name}
    $http.put('/api/students/'+$routeParams.id, query)
    .success(function(classObj){
      $scope.classObj = classObj;
      $location.path("admin");
    });
  }




  $scope.updateLogs = function(){
    $http({
      url: '/api/logs/',
      method: "GET",
      params: {filter:
      {where:{and : [{studentId:$routeParams.id}, {date:{gt:$scope.startDate}}, {date:{lt:$scope.endDate}}]},
        order:'date DESC',
        limit:10}
        }
    })
    .success(function(logs){
      $scope.logList = logs;
    });
  }


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

  $scope.openStart = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    if ($scope.openedStart) {
      $scope.openedStart = false;
    } else {
      $scope.openedStart = true;
    }
  };

  $scope.openEnd = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    if ($scope.openedEnd) {
      $scope.openedEnd = false;
    } else {
      $scope.openedEnd = true;
    }
  };


  $http.get('/api/students/'+$routeParams.id)
  .success(function(student){
    $scope.student = student;
  });

  $scope.updateLogs();


}]);
