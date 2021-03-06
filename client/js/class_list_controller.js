angular.module("beansprouts_app")
.controller("classListController", ["$scope", "$http", "dateFilterObjectService", "mySocket","sessionSettingService", function($scope, $http, dateFilterObjectService, mySocket, sessionSettingService) {

  $scope.pre_classes = [];
  $scope.after_classes = [];
  $scope.pick_up_locs = [];

  $scope.loaded = {pre: false, pickup:false, after: false}

  $scope.test_string = "test";

  $scope.status = sessionSettingService.classList.status



  $scope.getAttendanceFraction = function(classList){

    dateFilter =  dateFilterObjectService.getDateFilterObject()
    for (var i = 0; i < classList.length; i++){

    /*  (function(index){
        $http({
          url: '/api/seats/count',
          method: "GET",
          params: {
            where:{ and:[{classId:classList[index].id},dateFilterObjectService.getDateFilterObject()] }
          }
        })
        .success(function(res){
          classList[index].totalStudents = res.count;

        });

        $http({
          url: '/api/seats/count',
          method: "GET",
          params: {
            where:{ and:[{classId:classList[index].id}, {checked_in:true}, dateFilterObjectService.getDateFilterObject()] }
          }
        })
        .success(function(res){
          (function(i){
            classList[index].totalCheckedIn = res.count;
          }(i))
        });


      })(i) */


      (function(index){

        $http({
          url: '/api/seats/attendancefraction',
          method: "GET",
          params: {
            classId:classList[index].id,
            dayOfWeekFilterObject: dateFilter
          }
        })
        .success(function(result){
          classList[index].totalStudents = result.classSize;
          classList[index].totalCheckedIn = result.tally;
        });

      })(i)

    }
  }

  $scope.noClasses = function() {
    return $scope.loaded.pre && $scope.loaded.pickup && $scope.loaded.after &&($scope.pre_classes.length <= 0) && ($scope.pick_up_locs.length <= 0) && ($scope.after_classes.length <= 0);
  }

  $http.get("/api/classes?filter={\"where\":{\"class_type\":\"pre\"}}")
  .success(function(classes){
    $scope.pre_classes = classes;
    $scope.getAttendanceFraction($scope.pre_classes);
    $scope.loaded.pre = true;
  });

  $http.get("/api/classes?filter={\"where\":{\"class_type\":\"after\"}}")
  .success(function(classes){
    $scope.after_classes = classes;
    $scope.getAttendanceFraction($scope.after_classes);
    $scope.loaded.after = true;
  });

  $http.get("/api/classes?filter={\"where\":{\"class_type\":\"pickup\"}}")
  .success(function(classes){
    $scope.pick_up_locs = classes;
    $scope.getAttendanceFraction($scope.pick_up_locs);
    $scope.loaded.pickup = true;
  });

  $scope.$on('socket:update', function(event, classId){
    $scope.getAttendanceFraction($scope.findClass($scope.after_classes, classId));
    $scope.getAttendanceFraction($scope.findClass($scope.pre_classes, classId));
  });

  $scope.findClass = function(classList, id){
    var updateList = classList.filter(function(classObj){
      return classObj.id === id;
    });

    return updateList;
  }

}]);
