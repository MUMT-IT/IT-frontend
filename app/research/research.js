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
      $scope.citations_chart_data = [];
      var citations_annual = [];
      var citations_cum = [];
      var cc = 0; // cum citations
      for(var j=0; j < response.data.articles.length; j++) {
          var abs = response.data.articles[j];
          $scope.abstracts_chart_labels.push(abs.year);
          $scope.abstracts_chart_data.push(abs.value);
          for(var i=0; i < response.data.citations.length; i++) {
            var ctn = response.data.citations[i];
            if(ctn.year == abs.year) {
              citations_annual.push(ctn.value);
              cc = cc + ctn.value;
              citations_cum.push(cc);
            }
          }
      }
      $scope.citations_chart_data = [citations_annual, citations_cum];
      $scope.citations_series = ['Annual', 'Cumulative'];
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