'use strict';

describe('Controller: Login', function () {

  // load the controller's module
  beforeEach(module('beansporuts_app'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope. Bunch of horse hockey
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    // backend definition common for all tests
    authRequestHandler = $httpBackend.when('GET', '/auth.py')
                           .respond({userId: 'userX'}, {'A-Token': 'xxx'});

    MainCtrl = $controller('loginController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
