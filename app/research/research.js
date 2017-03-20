'use strict';

angular.module('myApp.research', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/research', {
    templateUrl: 'research/research.html',
    controller: 'ResearchCtrl'
  });
}])

.controller('ResearchCtrl', function($scope, $http) {
  $http.get('http://localhost:5050/api/abstracts/subject_areas/').then(function(response) {
      $scope.subject_areas = response.data;
      var affils = ['mumt', 'cmmt', 'kkmt'];
      $scope.subject_areas_series = ['Chemical Engineering', 'Chemistry',
                                      'Pharmacology, Toxicology and Pharmaceutics',
                                      'Computer Science']
      var subject_areas_series = ['CENG', 'CHEM', 'PHAR', 'COMP'];
      $scope.subject_areas_labels = [];
      $scope.total_articles_comp = [];
      $scope.subject_areas_data = [];
      $scope.subject_areas_citations_data = [];
      var years = ['2013','2014','2015','2016', '2017']
      $scope.total_articles_comp_labels = years;
      $scope.total_articles_comp_series = affils;
      for(var k=0; k < affils.length; k++) {
        var af = affils[k];
        var tmp = [];
        var total_articles = 0;
        for(var j=0; j < years.length; j++) {
          var year = years[j];
          for(var i=0; i < $scope.subject_areas[year].length; i++) {
            var itm = $scope.subject_areas[year][i];
            if(itm.area !== 'MULT' && itm.affil==af)
              total_articles = total_articles + itm.articles;
          }
          tmp.push(total_articles);
        }
        $scope.total_articles_comp.push(tmp.slice());
      }
      console.log($scope.total_articles_comp);
      for(var i=0; i < years.length; i++) {
        for(var j=0; j < affils.length; j++) {
          var y = years[i];
          var a = affils[j];
          var label = y + "-" + a;
          $scope.subject_areas_labels.push(label);
        }
      }
      var d = {};
      for(var x=0; x < subject_areas_series.length; x++) {
        var sa = subject_areas_series[x];
        var atmp = [];
        var ctmp = [];
        for(var i=0; i < years.length; i++) {
          var year = years[i];
          for(var j=0; j<affils.length; j++) {
            var af = affils[j];
            for(var k=0; k<$scope.subject_areas[year].length; k++) {
              var itm = $scope.subject_areas[year][k];
              if(itm.affil===af && itm.area===sa) {
                atmp.push(itm.articles);
                ctmp.push(itm.citations);
              }
            }
          }
        }
        $scope.subject_areas_data.push(atmp.slice());
        $scope.subject_areas_citations_data.push(ctmp.slice());
      }
      console.log($scope.subject_areas_data);
  })
  $scope.subject_areas_chart_options = {
    'animation': false,
    'legend': {
      'display': true
    },
    'scales': {
      'yAxes': [{
        'display': true,
        'scaleLabel': {
          'display': true,
          'labelString': 'Articles',
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
      $scope.citations_series = ['Yearly', 'Cumulative'];
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
  $http.get('http://localhost:5050/api/abstracts/2017').then(function(response) {
    $scope.abstracts = response.data.data;
  });
});