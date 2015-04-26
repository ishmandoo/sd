(function() {
    'use strict';

    angular
        .module('beansprouts_app')
        .controller('indexController', indexController);

    indexController.$inject = ['$scope', '$http', '$location'];

    function indexController($scope, $http, $location) {
        var vm = this;

        this.isLoginPage = isLoginPage;
        this.logout = logout;

        activate();

        function activate() {
          console.log($location);
        }

        function logout() {
          $http.post('/api/users/logout/')
          .success(function(data, status, headers, config) {
            $location.path("");
          })
          .error(function(data, status, headers, config){
            $location.path("");
          });
        }

        function isLoginPage() {
          return ($location.$$path === '/login') || ($location.$$path === '/');
        }
    }
})();
