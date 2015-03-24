var app = angular.module("beansprouts_app", ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngTouch', 'ngKeypad']);

app.run(['$http', '$cookieStore', '$location', function($http, $cookieStore, $location){
  var token = $cookieStore.get("authToken") || {}
  if (token){
    $http.defaults.headers.common.authorization = token;
  } else {
    $location.path("login");
  }
}]);

app.factory('httpResponseInterceptor',['$q','$location',function($q, $location){
  return {
    'responseError': function(rejection) {
      if (rejection.status == 401){
        console.log($location.path());
        if (($location.path()=="")||($location.path()=="/login")){
          return $q.reject(rejection);
        } else {
          $location.path('/login');
        }
      }
      return $q.reject(rejection);
    }
  }
}]);

app.config(['$httpProvider',function($httpProvider) {
  $httpProvider.interceptors.push('httpResponseInterceptor');
}]);


app.config(function($routeProvider){
  $routeProvider
  .when('/login',{
    templateUrl: 'login.html',
    controller: "loginController"
  })
  .when('/classes',{
    templateUrl: 'classes.html',
    controller: "classListController"
  })
  .when('/class/:id',{
    templateUrl: 'class.html',
    controller: "studentListController"
  })
  .when('/admin',{
    templateUrl: 'admin.html',
    controller: "adminController"
  })
  .when('/admin/class/:id',{
    templateUrl: 'edit_class.html',
    controller: "editClassController"
  })
  .when('/admin/teacher/:id',{
    templateUrl: 'edit_teacher.html',
    controller: "editTeacherController"
  })
  .when('/admin/student/:id',{
    templateUrl: 'edit_student.html',
    controller: "editStudentController"
  })
  .otherwise({
    templateUrl: 'login.html',
    controller: "loginController"
  })
});

app.service('dateFilterObjectService', function() {
  var weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  this.getDateFilterObject = function(){
    var dayOfWeek = weekday[new Date().getDay()];
    //dayOfWeek = 'monday'; //TEMPORARY CHANGE TO MAKE MONDAY STUDENT LISTS APPEAR

    var day_of_week_where_obj = {};

    day_of_week_where_obj["days_of_week." + dayOfWeek] = true;

    return day_of_week_where_obj;
  }
});
