var app = angular.module("beansprouts_app", ['ngRoute', 'controllers', 'ngCookies']);

app.run(['$http', '$cookieStore', '$location', function($http, $cookieStore, $location){
  var token = $cookieStore.get("authToken") || {}
  if (token){
    $http.defaults.headers.common.authorization = token;
  } else {
    $location.path("login");
  }
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
  .otherwise({
    templateUrl: 'login.html',
    controller: "loginController"
  })
});
