(function() {
    'use strict';

    angular
        .module('beansprouts_app')
        .controller('indexController', indexController);

    indexController.$inject = ['$scope', '$http', '$location','schoolService'];

    function indexController($scope, $http, $location, schoolService) {
        var vm = this;

        this.isLoginPage = isLoginPage;
        this.logout = logout;
        this.isAdmin = false;
        this.hideAdminButton = true;
        this.hideClassButton = true;
        this.hideBackButton = true;
        this.isAdminSide = isAdminSide;
        this.goToAdmin = goToAdmin;
        this.goToClassList = goToClassList;
        this.goBack = goBack;
        this.bannerPath = schoolService.bannerPath
        this.getBanner = getBanner

        activate();

        function activate() {
          $scope.$on( "$routeChangeSuccess", function(event, next, current) {
            updateNav();
            isUserAdmin();

          });
          updateNav();
          isUserAdmin();
        }
        function getBanner(){
          return schoolService.bannerPath
        }

        function goBack() {
          window.history.back();
        }

        function updateNav(){
          updateClassButton();
          updateAdminButton();
          updateBackButton();
        }

        function updateBackButton() {
          vm.hideBackButton = isAdminPage() || isLoginPage() || isClassListPage();
        }

        function updateClassButton(){

          vm.hideClassButton = !vm.isAdmin || (!isAdminSide()) || (isLoginPage());

        }

        function updateAdminButton(){
          vm.hideAdminButton = !vm.isAdmin || (isAdminSide()) || (isLoginPage());
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


        function isClassListPage() {
          return ($location.$$path === '/classes');
        }

        function isAdminPage() {
          return ($location.$$path === '/admin');
        }

        function isLoginPage() {
          return ($location.$$path === '/login') || ($location.$$path === '/') || ($location.$$path === '');
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
