(function() {
    'use strict';

    angular
        .module('beansprouts_app')
        .controller('headController', headController);

    headController.$inject = ['schoolService'];

    function headController(schoolService) {
        var vm = this;

        activate();

        function activate() {
          vm.customStylePath = schoolService.stylePath

        }
    }
})();
