(function() {
    'use strict';

    angular
        .module('beansprouts_app')
        .factory('sessionSettingService', sessionSettingService);

        sessionSettingService.$inject = [];

    function sessionSettingService() {

        var classList = {}
        classList.status = {}
        classList.status.preOpen = true;
        classList.status.pickupOpen = true;
        classList.status.afterOpen = true;



        var service = {
          classList: classList
        };



        return service;





    }
})();
