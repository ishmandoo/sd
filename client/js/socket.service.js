(function() {
    'use strict';

    angular
        .module('beansprouts_app')
        .factory('mySocket', factory);

    factory.$inject = ['socketFactory'];

    function factory(socketFactory) {
        var mySocket = socketFactory();
        mySocket.forward('update');
        console.log("FactoryRunning");
        mySocket.on('test', function(){

          console.log("Successfulsocket");
        })
        return mySocket;

    }
})();
