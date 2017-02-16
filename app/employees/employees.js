'use strict';

angular.module('myApp.employees', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/employees', {
    templateUrl: 'employees/employees.html',
    controller: 'EmployeeController'
  });
}])

.controller('EmployeeController', function($scope, $http) {
  $http.get('http://localhost:5000/api/employees/').then(
    function(response) {
      $scope.employees = response.data.employees
      $scope.flt_employees = $scope.employees.slice();
    }
  )
  $scope.query = "";
  $scope.affiliation = "0";
  $scope.selectAffil = function() {
    $scope.flt_employees = [];
      if ($scope.affiliation === "0") {
        $scope.flt_employees = $scope.employees.slice();
      } else {
        for (var i = 0; i < $scope.employees.length; i++) {
          if ($scope.employees[i].affiliation_id.toString() === $scope.affiliation) {
            console.log($scope.employees[i].affiliation_id);
            $scope.flt_employees.push($scope.employees[i]);
        }
      }
    }
  }
  $scope.searchFor =  function() {
    $scope.flt_employees = [];
    for (var i = 0; i < $scope.employees.length; i++) {
      var first_th_search = $scope.employees[i]['first_th'].search($scope.query);
      var first_en_search = $scope.employees[i]['first_en'].search($scope.query);
      var last_th_search = $scope.employees[i]['last_th'].search($scope.query);
      var last_en_search = $scope.employees[i]['last_en'].search($scope.query);
      if (first_th_search > -1 ||
            first_en_search > -1 ||
            last_th_search > -1 ||
            last_en_search > -1) {
        $scope.flt_employees.push($scope.employees[i]);
      }
    }
  }
});