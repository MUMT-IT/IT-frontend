'use strict';

angular.module('myApp.employees', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/employees', {
    templateUrl: 'employees/employees.html',
    controller: 'EmployeeController'
  });
}])

.controller('EmployeeController', [function() {

}]);