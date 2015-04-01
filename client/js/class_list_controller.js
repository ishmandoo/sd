angular.module("beansprouts_app")
.controller("classListController", ["$scope", "$http", "dateFilterObjectService", function($scope, $http, dateFilterObjectService) {

  $scope.pre_classes = [];
  $scope.after_classes = [];
  $scope.pick_up_locs = [];

  $scope.test_string = "test";


  $scope.getAttendanceFraction = function(classList){


    console.log(classList);

    for (var i = 0; i < classList.length; i++){

      (function(index){
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


      })(i)
    }
  }

  $http.get("/api/classes?filter={\"where\":{\"class_type\":\"pre\"}}")
  .success(function(classes){
    $scope.pre_classes = classes;
    $scope.getAttendanceFraction($scope.pre_classes);
  });

  $http.get("/api/classes?filter={\"where\":{\"class_type\":\"after\"}}")
  .success(function(classes){
    $scope.after_classes = classes;
    $scope.getAttendanceFraction($scope.after_classes);
  });

  $http.get("/api/classes?filter={\"where\":{\"class_type\":\"pickup\"}}")
  .success(function(classes){
    $scope.pick_up_locs = classes;
    $scope.getAttendanceFraction($scope.pick_up_locs);
  });

}]);
