angular.module("beansprouts_app")
.controller("loginController", ["$scope", "$http", "$location", "$window", "$cookieStore", function($scope, $http, $location, $window, $cookieStore){
  $scope.loginFailed = false;

  $scope.logIn = function(username, password){
    $http.post('/api/teachers/login/', {username:$scope.username, password:$scope.password, ttl:60*10*1000}).
    success(function(data, status, headers, config) {
      $http.defaults.headers.common.authorization = data.id;
      $cookieStore.put("authToken", data.id);
      console.log("logged in");
      $location.path("classes");
    }).
    error(function(data, status, headers, config){
      $scope.loginFailed = true;
    });

  }

  $scope.logInAdmin = function(username, password){
    $http.post('/api/admins/login/', {username:$scope.username, password:$scope.password, ttl:60*10*1000})
    .success(function(data, status, headers, config) {
      $http.defaults.headers.common.authorization = data.id;
      $cookieStore.put("authToken", data.id);
      console.log("logged in admin");
      $location.path("admin");

    })
    .error(function(data, status, headers, config){
      $scope.loginFailed = true;
    });
  }

  $scope.register = function(username, password){
    $http.post('/api/teachers/', {username:$scope.username, password:$scope.password})
    .success(function(data, status, headers, config) {
      $window.sessionStorage.token = data.token;
      console.log("registered")
      $location.path("classes")
    });
  }
}]);
