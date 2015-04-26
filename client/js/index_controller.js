(function() {
    'use strict';

    angular
        .module('beansprouts_app')
        .controller('indexController', indexController);

    indexController.$inject = ['$scope', '$http', '$location'];

    function indexController($scope, $http, $location) {
        var vm = this;

        this.logout = logout;

        activate();

        function activate() {

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
    }
})();
