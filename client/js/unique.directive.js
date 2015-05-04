(function() {
  'use strict';

  angular
  .module('beansprouts_app')
  .directive('unique', unique);

  function unique($q, $http) {
    var directive = {
      require: 'ngModel',
      restrict: 'A',
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, elm, attrs, ctrl) {
      ctrl.$asyncValidators.unique = function(modelValue, viewValue) {

        if (ctrl.$isEmpty(modelValue)) {
          // consider empty model valid
          return $q.when();
        }

        console.log(attrs);

        var def = $q.defer();

        var whereObj = {};
        whereObj[attrs.attribute] = modelValue;

        $http({
          url: '/api/' + attrs.model,
          method: "GET",
          params: {filter: {where:whereObj}}
        }).success(function(data){
          console.log(data);
          if (data.length<=0) {
            def.resolve();
          } else {
            if (attrs.except && data[0].name === attrs.except) {
              def.resolve();
            } else {
            def.reject();
            }
          }
        });


        return def.promise;
      };

    }
  }


})();
