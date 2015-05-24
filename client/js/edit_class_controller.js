angular.module("beansprouts_app")
.controller("editClassController", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location){

  $scope.classObj = {};
  $scope.seatList = [];
  $scope.autoCompleteList = [];
  $scope.studentIndex = 0;
  $scope.clickedSeatId = "";

  $scope.autoCompleteStudents = {};
  $scope.timeBlockList = [];

  $scope.newStudent = {name:""};

  $scope.updateClass = function(){
    if($routeParams.id){
      $http.put('/api/classes/'+$routeParams.id, {name:$scope.classObj.name, class_type: $scope.classObj.class_type})
      .success(function(classObj){
        $scope.classObj = classObj;
        $location.path("admin");
      });
    }
  }

  $scope.updateSeat = function(seat, day_of_week) {
    seat.days_of_week[day_of_week] = !seat.days_of_week[day_of_week];
    $http.put('/api/seats/'+seat.id, {days_of_week:seat.days_of_week})
    .success(function(classObj){
    });
  }

  $scope.addStudent = function(){
    if($routeParams.id){
      $http.put('/api/classes/'+$routeParams.id+'/students/rel/'+$scope.autoCompleteStudents[$scope.studentIndex].id,{
        checked_in:false,
        days_of_week:{
          monday:true,
          tuesday:true,
          wednesday:true,
          thursday:true,
          friday:true,
          saturday:false,
          sunday:false
        }
      })
      .success(function(student){
        $scope.getSeatList();
        $scope.newStudent.name = "";
      });
    }
  }

  $scope.removeStudent = function(student){
    if($routeParams.id){
      $http.delete('/api/classes/'+$routeParams.id+'/students/rel/'+student.id)
      .success(function(student){
        $scope.getSeatList();
      });
    }
  }

  $scope.invalidStudent = function() {
    if($scope.newStudent.name.length >= 3){
      for(var i =0; i < $scope.autoCompleteStudents.length; i++){
        if($scope.newStudent.name == $scope.autoCompleteStudents[i].name){
          $scope.studentIndex = i;
          return false;
        }
      }
    }
    return true;
  }

  $scope.getAutoCompleteStudents = function() {
    return $http.get("/api/students?filter={\"where\":{\"name\": {\"like\" : \"" + $scope.newStudent.name + "\",\"options\": \"i\"}}}")
    .then(function(response){
      $scope.autoCompleteStudents = response.data;
      return response.data;
    });
  };

  $scope.getTimeBlocks = function() {
    return $http.get("/api/timeblocks")
    .then(function(response){
      $scope.timeBlocks = response.data;
    });
  };

  $scope.getSeatList = function() {
    //$http.get('/api/classes/'+$routeParams.id+'/students')
    $http({
      url: '/api/seats/',
      method: "GET",
      params: {
        filter:{
          where:{classId:$routeParams.id},
          include:[{relation:'student'},{relation:'timeblocks'}]
        }
      }
    })
    .success(function(seatList){
      $scope.seatList = seatList;
    });
  }

  $scope.addTimeBlock = function(seat, timeblock) {
    $http({
      url: '/api/seats/'+seat.id+'/timeblocks/rel/'+timeblock.id,
      method: "PUT",
    })
    .success(function(){
      $scope.getSeatList();
    });
  }

  $scope.removeTimeBlock = function(seat, timeblock) {
    $http({
      url: '/api/seats/'+seat.id+'/timeblocks/rel/'+timeblock.id,
      method: "DELETE",
    })
    .success(function(){
      $scope.getSeatList();
    });
  }



  $http.get('/api/classes/'+$routeParams.id)
  .success(function(classObj){
    $scope.classObj = classObj;
    $scope.classObj.original_name = classObj.name;
  });

  $scope.getSeatList();
  $scope.getTimeBlocks();


}]);
