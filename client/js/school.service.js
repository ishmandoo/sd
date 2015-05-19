(function() {
    'use strict';

    angular
        .module('beansprouts_app')
        .factory('schoolService', schoolService);

    schoolService.$inject = [''];

    function schoolService() {
        var name = "Sheepdog";
        var stylePath = "";
        var bannerPath = "res/banner_beta.png";

        var service = {
            name: name,
            stylePath:stylePath,
            bannerPath:bannerPath
        };

        return service;

        function getName() {

        }
    }
})();
