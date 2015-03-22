angular.module("beansprouts_app")
.controller("classListController", ["$scope", "$http", function($scope, $http){

  $scope.pre_classes = [];
  $scope.after_classes = [];
  $scope.pick_up_locs = [];

  var weekday = new Array(7);
  weekday[0]=  "sunday";
  weekday[1] = "monday";
  weekday[2] = "tuesday";
  weekday[3] = "wednesday";
  weekday[4] = "thursday";
  weekday[5] = "friday";
  weekday[6] = "saturday";
  var today = new Date();
  var dayOfWeek = weekday[today.getDay()];


  $scope.getAttendanceFraction = function(classList){
    var day_of_week_where_obj = {}

    dayOfWeek="monday"; // THIS IS A TEMPORARY CHANGE THAT MAKES IT ALWAYS DISPLAY MONDAY CLASS LISTS

    day_of_week_where_obj["days_of_week."+dayOfWeek] = true;


    console.log(classList);

    for (var i = 0; i < classList.length; i++){

      (function(index){
        $http({
          url: '/api/seats/count',
          method: "GET",
          params: {
            where:{ and:[{classId:classList[index].id},day_of_week_where_obj] }
          }
        })
        .success(function(res){
          classList[index].totalStudents = res.count;

        });

        $http({
          url: '/api/seats/count',
          method: "GET",
          params: {
            where:{ and:[{classId:classList[index].id}, {checked_in:true}, day_of_week_where_obj] }
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
