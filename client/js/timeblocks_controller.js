(function() {
    'use strict';

    angular
        .module('beansprouts_app')
        .controller('timeBlocksController', timeBlocksController);

    timeBlocksController.$inject = ['$http', 'uniqueDirective'];

    function timeBlocksController($http) {
        var vm = this;
        vm.timeBlocks = [];
        vm.start_date = new Date()
        vm.start_date.setHours(0,0,0)
        vm.end_date = new Date()
        vm.end_date.setHours(0,0,0)
        vm.newTimeBlock = {start_date:vm.start_date, end_date:vm.end_date, name:"", week_schedule:{monday:true,tuesday:true,wednesday:true,thursday:true,friday:true, saturday:false, sunday:false}}
        vm.updateTimeBlock = updateTimeBlock;
        vm.deleteTimeBlock = deleteTimeBlock;
        vm.addNewTimeBlock = addNewTimeBlock;

        activate();

        function activate() {
          getTimeBlocks();
        }

        function getTimeBlocks() {
          $http.get('/api/timeblocks')
          .success(function(data){
            vm.timeBlocks = data;
            for (var i = 0; i<vm.timeBlocks.length; i++) {
              vm.timeBlocks[i].start_date = new Date(vm.timeBlocks[i].start_date)
              vm.timeBlocks[i].end_date = new Date(vm.timeBlocks[i].end_date)
            }
          });
        }

        function updateTimeBlock(timeBlock) {
          $http.put('/api/timeblocks/'+timeBlock.id, timeBlock)
          .success(function(){
            getTimeBlocks();
          });
        }

        function deleteTimeBlock(timeBlock) {
          $http.delete('/api/timeblocks/'+timeBlock.id)
          .success(function(){
            getTimeBlocks();
          });
        }

        function addNewTimeBlock() {
          $http.post('/api/timeblocks/', vm.newTimeBlock)
          .success(function(){
            vm.newTimeBlock.name=""
            getTimeBlocks();
          });
        }
    }
})();
