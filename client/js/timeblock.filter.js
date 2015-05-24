(function() {
    'use strict';

    angular
        .module('beansprouts_app')
        .filter('withNew', withNew);

    function withNew() {
        return withNewFilter

        function withNewFilter(params, str) {
            var out = [];
            for (var i = 0; i < params.length; i++) {
              if ((String(params[i].name).toLowerCase().match(str.toLowerCase())) || (params[i].new)) {
                out.push(params[i]);
              }
            }
            return out;
        }
    }
})();
