(function() {
    'use strict';

    angular
        .module('beansprouts_app')
        .factory('confirmDeletionService', confirmDeletionService);

        confirmDeletionService.$inject = ['$modal'];

    function confirmDeletionService($modal) {
        var service = {
            confirmDeletion: confirmDeletion
        };

        return service;

        function confirmDeletion () {
          var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'html/deletion_modal_template.html',
            windowClass: 'center-modal',
            size: 'sm'
          });

          return modalInstance.result;
        }
    }
})();
