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
        vm.invoiceUrl="";

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

        function getInvoiceUrl() {
          var params = {
            from: 'Sheepdog, LLC',
            to: 'Beansprouts',
            number: 1,
            items: [
              {
                name: "Gizmo",
                quantity: 10,
                unit_cost: 99.99,
                description: "The best gizmos there are around."
              }]
          }
          vm.invoiceUrl = 'https://invoice-generator.com?' + $.param(params);
        }
    }
})();
