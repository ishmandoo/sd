(function() {
    'use strict';

    angular
        .module('beansprouts_app')
        .controller('importController', importController);

    importController.$inject = ['$http'];

    function importController($http) {
        var vm = this;
        vm.list = "";
        vm.importStudents = importStudents;

        activate();

        function activate() {

        }

        function importStudents() {
          var list = vm.list.split('\n');
          for (var i = 0; i<list.length; i++) {

            (function(name) {
              $http({
                url: '/api/students',
                method: "GET",
                params: {filter: {where:{name:name}}}
              }).success(function(data){
                console.log(data)
                if (data.length == 0) {
                  $http.post('/api/students/', {name:name, status:"checked out", last_action_date:new Date()})
                  .success(function(student){
                  });
                }
              });
            })(list[i])

          }

          vm.list="";
        }
    }
})();
