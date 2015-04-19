angular.module("beansprouts_app")
.controller("editStudentController", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location){

  $scope.student = {};
  $scope.seatList = [];
  $scope.logList = [];
  $scope.noteList = [];

  $scope.notes = {};
  $scope.notes.datebox = new Date()

  lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth()-1);
  $scope.startDate = lastMonth;
  $scope.endDate = new Date();

  $scope.noteList.startDate = new Date();
  nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth()+1);
  $scope.noteList.endDate = nextMonth;


  $scope.classIndex = 0;

  $scope.autoCompleteClasses = {};

  $scope.newClass = {name:""};

  $scope.update = function(){
    var query = {name:$scope.student.name, pin:$scope.student.pin}
    $http.put('/api/students/'+$routeParams.id, query)
    .success(function(classObj){
      $scope.classObj = classObj;
      $location.path("admin");
    });
  }

  $scope.updateSeat = function(seat, day_of_week) {
    seat.days_of_week[day_of_week] = !seat.days_of_week[day_of_week];
    $http.put('/api/seats/'+seat.id, {days_of_week:seat.days_of_week})
    .success(function(classObj){
    });
  }


  $scope.updateLogs = function(){
    $http({
      url: '/api/logs/',
      method: "GET",
      params:{
        filter:{
          where:{
            and : [{studentId:$routeParams.id}, {date:{gt:$scope.startDate}}, {date:{lt:$scope.endDate}}]
          },
          //include:[{relation:'teacher'},{relation:'class'},{relation:'student'}],
          order:'date DESC',
          limit:10
        }
      }
    })
    .success(function(logs){
      $scope.logList = logs;
    });
  }

  $scope.updateNotes = function(){
    $http({
      url: '/api/notes/',
      method: "GET",
      params:{
        filter:{
          where:{
            studentId:$routeParams.id
          },
          //include:[{relation:'teacher'},{relation:'class'},{relation:'student'}],
          order:'date DESC',
          limit:10
        }
      }
    })
    .success(function(notes){
      //notes.startDate = $scope.noteList.startDate
      //notes.endDate = $scope.noteList.endDate;
      $scope.noteList = notes;
    });
  }

  $scope.addNote = function(){
    $http.post('/api/notes/',
    {
      "studentId":$routeParams.id,
      "text": $scope.notes.textbox,
      "date": $scope.notes.datebox
    })
    .success(function(note){
      $scope.updateNotes()
      $scope.notes.textbox = "";
    });
  }

  $scope.removeNote = function(note){
    if($routeParams.id){
      $http.delete('/api/notes/'+note.id)
      .success(function(note){
        $scope.updateNotes();

      });
    }
  }

  $scope.addClass = function(){
    if($routeParams.id){
      $http.put('/api/students/'+$routeParams.id+'/classes/rel/'+$scope.autoCompleteClasses[$scope.classIndex].id,{
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
      .success(function(classObj){
        $scope.getSeatList();
        $scope.newClass.name = "";
      });
    }
  }

  $scope.removeClass = function(classObj){
    if($routeParams.id){
      $http.delete('/api/students/'+$routeParams.id+'/classes/rel/'+classObj.id)
      .success(function(classObj){
        $scope.getSeatList();
      });
    }
  }

  $scope.invalidClass = function() {
    if($scope.newClass.name.length >= 3){
      for(var i =0; i < $scope.autoCompleteClasses.length; i++){
        if($scope.newClass.name == $scope.autoCompleteClasses[i].name){
          $scope.classIndex = i;
          return false;
        }
      }
    }
    return true;
  }

  $scope.getAutoCompleteClasses = function() {
    return $http.get("/api/classes?filter={\"where\":{\"name\": {\"like\" : \"" + $scope.newClass.name + "\",\"options\": \"i\"}}}")
    .then(function(response){
      $scope.autoCompleteClasses = response.data;
      return response.data;
    });
  };


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

  $scope.getSeatList = function() {
    //$http.get('/api/classes/'+$routeParams.id+'/students')
    $http({
      url: '/api/seats/',
      method: "GET",
      params: {
        filter:{
          where:{studentId:$routeParams.id},
          include:{relation:'class'}
        }
      }
    })
    .success(function(seatList){
      $scope.seatList = seatList;
    });
  }


  $http.get('/api/students/'+$routeParams.id)
  .success(function(student){
    $scope.student = student;
  });

  $scope.getSeatList();
  $scope.updateLogs();
  $scope.updateNotes();


}]);
