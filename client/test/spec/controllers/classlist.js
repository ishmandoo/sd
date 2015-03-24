'use strict';

describe('Controller: Class list', function () {

  // load the controller's module
  beforeEach(module('beansprouts_app'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    // backend definition common for all tests
    authRequestHandler = $httpBackend.when('GET', '/auth.py')
                           .respond({userId: 'userX'}, {'A-Token': 'xxx'});

    MainCtrl = $controller('classListController', {
      $scope: scope
    });
  }));


  it('test testing', function () {
    expect(scope.weekday[0]).toBe('sunday');
  });
});
