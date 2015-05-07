angular.module("beansprouts_app")
.controller("loginController", ["$scope", "$http", "$location", "$window", "$cookieStore", function($scope, $http, $location, $window, $cookieStore){
  $scope.loginFailed = false;

  $scope.logIn = function(username, password){
    $http.post('/api/teachers/login/', {username:$scope.username, password:$scope.password, ttl:60*100*1000}).
    success(function(data, status, headers, config) {
      $http.defaults.headers.common.authorization = data.id;
      $cookieStore.put("authToken", data.id);
      console.log("logged in");
      $location.path("classes");
      console.log(data);
      $http.get('/api/teachers/'+data.userId+"?filter={\"include\":{\"relation\":\"roleMappings\"}}")
      .success(function(teacher){
        if((teacher.roleMappings.length >= 1) && (teacher.roleMappings[0].roleId == 1)){
          $location.path("admin");
        }
      });
    }).
    error(function(data, status, headers, config){
      $scope.loginFailed = true;
    });

  }

  $scope.logInAdmin = function(username, password){
    $http.post('/api/admins/login/', {username:$scope.username, password:$scope.password, ttl:60*100*1000})
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
