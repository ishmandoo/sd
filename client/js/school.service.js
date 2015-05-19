(function() {
    'use strict';

    angular
        .module('beansprouts_app')
        .factory('schoolService', schoolService);

    schoolService.$inject = ['$http'];

    function schoolService($http) {
        var name = "Sheepdog";
        var stylePath = "";
        var bannerPath = "";



        var service = {
            name: name,
            stylePath:stylePath,
            bannerPath:bannerPath
        };

        getSchool(service)

        return service;


        function getSchool(service){
          $http.get('/api/schools')
          .success(function(response){
            var school = response[0]
            if(school.banner_path){
              service.bannerPath = school.banner_path;
            }
            if(school.style_path){
              stylePath = school.style_path;

            }
          });
        }


    }
})();
