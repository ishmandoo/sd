(function() {
    'use strict';

    angular
        .module('beansprouts_app')
        .controller('importController', importController);

    importController.$inject = ['$http'];

    function importController($http) {
        var vm = this;
        vm.addStudentList = "";
        vm.addStudentToClassList = "";
        vm.importStudents = importStudents;
        vm.addStudentsToClass = addStudentsToClass;
        vm.classList = [];
        vm.selectedClass = "test";

        activate();

        function activate() {
          getClasses();
        }

        function importStudents() {
          var list = vm.addStudentList.split('\n');

          var uniqueList = [];
          $.each(list, function(i, el){
            if($.inArray(el, uniqueList) === -1) uniqueList.push(el);
          });

          for (var i = 0; i<uniqueList.length; i++) {


            (function(name) {
              console.log(name);
              $http({
                url: '/api/students',
                method: "GET",
                params: {filter: {where:{name:name}}}
              }).success(function(data){
                console.log(data)
                if (data.length == 0) {
                  $http.post('/api/students/', {name:name, status:"checked out", last_action_date:new Date()})
                  .success(function(student){
                  });
                } else {
                  vm.addStudentList += (name + "\n");
                }
              });
            })(uniqueList[i])

          }

          vm.addStudentList="";
        }

        function addStudentsToClass() {
          var list = vm.addStudentToClassList.split('\n');
          for (var i = 0; i<list.length; i++) {

            (function(name) {
              $http({
                url: '/api/students',
                method: "GET",
                params: {filter: {where:{name:name}}}
              }).success(function(data){
                if (data.length == 1) {
                  addStudent(data[0].id);
                } else {
                  vm.addStudentsToClassList += (name + "\n");
                }
              });
            })(list[i])

          }

          vm.addStudentToClassList="";
        }

        function addStudent(studentId){
          $http.put('/api/classes/'+vm.selectedClass.id+'/students/rel/'+studentId,{
            checked_in:false,
            days_of_week:{
              monday:true,
              tuesday:true,
              wednesday:true,
              thursday:true,
              friday:true,
              saturday:false,
              sunday:false
            }
          })
          .success(function(student){
            console.log(student)
          });
        }

        function getClasses() {
          $http({
            url: '/api/classes',
            method: "GET"
          }).success(function(data){
            vm.classList = data;
          });
        }
    }
})();
