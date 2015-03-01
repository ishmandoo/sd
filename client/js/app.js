var app = angular.module("beansprouts_app", ['ngRoute', 'controllers', 'ngCookies']);

app.run(['$http', '$cookieStore', function($http, $cookieStore){
  var token = $cookieStore.get("authToken") || {}
  if (token){
    $http.defaults.headers.common.authorization = token;
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
