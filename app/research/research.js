'use strict';

angular.module('myApp.research', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/research', {
    templateUrl: 'research/research.html',
    controller: 'ResearchCtrl'
  });
}])

.controller('ResearchCtrl', function($scope, $http) {
  $http.get('http://localhost:5050/api/abstracts/2017').then(function(response) {
      $scope.abstracts = response.data.data;
  })
  $http.get('http://localhost:5050/api/abstracts/').then(function(response) {
      $scope.abstracts_chart_labels = [];
      $scope.abstracts_chart_data = [];
      for(var j=0; j < response.data.data.length; j++) {
          var item = response.data.data[j];
          $scope.abstracts_chart_labels.push(item.year);
          $scope.abstracts_chart_data.push(item.value);
      }
      console.log($scope.abstracts_chart_data)
      console.log($scope.abstracts_chart_labels)
  })

  $scope.chart_options = {
    'animation': false,
    'legend': {
      'display': true
    },
    'scales': {
      'yAxes': [{
        'display': true,
        'scaleLabel': {
          'display': true,
          'labelString': 'Score',
          'fontSize': 16
        },
        'ticks': {
          'beginAtZero': true,
          'fontSize': 16
        }
      }],
      'xAxes': [{
        'ticks': {
          'fontSize': 16
        }
      }]
    }
  }
});