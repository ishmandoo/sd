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
        this.isAdmin = false;
        this.hideAdminButton = true;
        this.hideClassButton = true;
        this.isAdminSide = isAdminSide;
        this.goToAdmin = goToAdmin;
        this.goToClassList = goToClassList;

        activate();

        function activate() {
          $scope.$on( "$routeChangeSuccess", function(event, next, current) {
            updateNav();
            isUserAdmin();

          });
          updateNav();
          isUserAdmin();
        }

        function updateNav(){
          updateClassButton()
          updateAdminButton()
        }

        function updateClassButton(){

          vm.hideClassButton = !vm.isAdmin || (!isAdminSide()) || (isLoginPage())
      
        }

        function updateAdminButton(){
          vm.hideAdminButton = !vm.isAdmin || (isAdminSide()) || (isLoginPage())
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

        function isAdminSide() {
          return ($location.$$path.split('/')[1] === "admin");

        }

        function goToAdmin() {
          $location.path("admin");
        }

        function goToClassList() {
          $location.path("classes");
        }

        function isUserAdmin() {
          if(isLoginPage()){
            vm.isAdmin = false;
          }else{
            $http.get('/api/teachers/currentisadmin')
            .success(function(response){
              vm.isAdmin = response.isAdmin;
              updateNav();
            });
          }
        }
    }
})();
