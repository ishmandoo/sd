describe('class_list_controller', function() {
  beforeEach(module('beansprouts_app'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('test string', function() {
    it('check test string', function() {
      var $scope = {};
      var controller = $controller('classListController', { $scope: $scope });
      expect($scope.test_string).toEqual('test');
    });
  });
});
