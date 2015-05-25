(function() {
    'use strict';

    angular
        .module('beansprouts_app')
        .controller('billingController', billingController);

        billingController.$inject = ['$http'];

    function billingController($http) {
        var vm = this;
        vm.billableStudents = 0;
        vm.startDate = new Date();
        vm.endDate = new Date();
        vm.startDate.setMonth( vm.endDate.getMonth( ) - 1 );
        vm.getBillableStudents = getBillableStudents;

        activate();

        function activate() {
          getBillableStudents();
        }

        function getBillableStudents() {
          $http({
            url: '/api/logs/billablestudents',
            method: "GET",
            params: {
              startDate: vm.startDate,
              endDate: vm.endDate
            }
          })
          .success(function(res){
            vm.billableStudents = res.billableStudents;
          });
        }
    }
})();
