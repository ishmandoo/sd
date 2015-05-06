(function() {
    'use strict';

    angular
        .module('beansprouts_app')
        .directive('compareTo', compareTo);

    function compareTo() {
        var directive = {
          require: 'ngModel',
          link: linkFunc,
          scope: {
            otherModelValue: "=compareTo"
          }
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {

          ctrl.$validators.compareTo = function(modelValue) {
            return modelValue == scope.otherModelValue;
          };

          scope.$watch("otherModelValue", function() {
            ctrl.$validate();
          });
        }
    }

})();
