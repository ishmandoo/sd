var app = angular.module("beansprouts_app", ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngTouch', 'ngKeypad','btford.socket-io']);

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

app.factory('httpResponseErrorInterceptor',function($q, $injector, $timeout) {
  return {
    'responseError': function(response) {
        if (response.status === 0) {
            // should retry
            return $timeout(function(){
                if (response.config.backoff) {
                    response.config.backoff *= 1.1;
                } else {
                    response.config.backoff = 100;
                }
                console.log(response.config);
                var $http = $injector.get('$http');
                return $http(response.config);
            }, response.config.backoff);
        }

        return $q.reject(response)
    }
  };
});

app.config(function($httpProvider) {
  $httpProvider.interceptors.push('httpResponseErrorInterceptor');
});


app.config(function($routeProvider){
  $routeProvider
  .when('/login',{
    templateUrl: 'html/login.html',
    controller: "loginController"
  })
  .when('/classes',{
    templateUrl: 'html/classes.html',
    controller: "classListController"
  })
  .when('/class/:id',{
    templateUrl: 'html/class.html',
    controller: "studentListController"
  })
  .when('/admin',{
    templateUrl: 'html/admin.html',
    controller: "adminController"
  })
  .when('/admin/timeblocks',{
    templateUrl: 'html/timeblocks.html',
    controller: "timeBlocksController",
    controllerAs: "tb"
  })
  .when('/admin/class/:id',{
    templateUrl: 'html/edit_class.html',
    controller: "editClassController"
  })
  .when('/admin/teacher/:id',{
    templateUrl: 'html/edit_teacher.html',
    controller: "editTeacherController"
  })
  .when('/admin/student/:id',{
    templateUrl: 'html/edit_student.html',
    controller: "editStudentController"
  })
  .when('/admin/billing',{
    templateUrl: 'html/billing.html',
    controller: "billingController",
    controllerAs: "bill"
  })
  .when('/admin/import',{
    templateUrl: 'html/import.html',
    controller: "importController",
    controllerAs: "import"
  })
  .otherwise({
    templateUrl: 'html/login.html',
    controller: "loginController"
  })
});

app.service('dateFilterObjectService', function() {
  var weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  this.getDateFilterObject = function(){
    var dayOfWeek = weekday[new Date().getDay()];

    if ((dayOfWeek == 'saturday') || (dayOfWeek == 'sunday')) {
      dayOfWeek = 'monday'; //TEMPORARY CHANGE TO MAKE MONDAY STUDENT LISTS APPEAR
    }

    var day_of_week_where_obj = {};

    day_of_week_where_obj["days_of_week." + dayOfWeek] = true;

    return day_of_week_where_obj;
  }
});
