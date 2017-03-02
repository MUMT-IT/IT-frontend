'use strict';

angular.module('myApp.education', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/education', {
    templateUrl: 'education/education.html',
    controller: 'EducationCtrl'
  });
}])

.controller('EducationCtrl', function($scope, $http) {
  /*
  $http.get('http://localhost:5000/api/gdrive/files/').then(
    function(response) {
      $scope.files = response.data.files
    }
  , function(error) {
      console.log(error);
  })
  */
  $http.get('http://localhost:5000/api/wrs/results/').then(
    function(response) {
      $scope.wrs_data = [];
      $scope.wrs_chart_options = {
        'title': {
          'text': 'ผลการประเมินตนเองของผู้เรียนปี 4 ต่อพัฒนาการตามคุณลักษณะ Wellrounded Scholar',
          'display': true,
          'fontSize': 18
        },
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
      var post = [false, true];
      $scope.wrs_labels = [];
      var pre_data = {'knowledge': [], 'prof_skill': [], 'analysis': [],
                      'creativity': [], 'socialrep': [], 'leadership': []};
      var post_data = {'knowledge': [], 'prof_skill': [], 'analysis': [],
                      'creativity': [], 'socialrep': [], 'leadership': []};
      $scope.wrs_data = [];
      var series = {'knowledge': 'ความรู้', 'prof_skill': 'ทักษะในวิชาชีพ',
                    'creativity': 'ความคิดสร้างสรรค์',
                    'analysis': 'การคิดวิเคราะห์', 'leadership': 'ภาวะผู้นำ',
                    'socialrep': 'การมุ่งช่วยเหลือสังคม'};
      for(var i=0; i < response.data['data'].length; i++) {
        var year = response.data['data'][i]['year'];
        $scope.wrs_labels.push(year+'-ก่อน');
        $scope.wrs_labels.push(year+'-หลัง');
        var res = response.data['data'][i]['results'];
        for(var j=0; j < res.length; j++) {
          var item = res[j];
          if(item['post']) {
            post_data[item['question']].push(item['value']);
          } else {
            pre_data[item['question']].push(item['value']);
          }
        }
      }
      $scope.cutoff = [
        {
          label: "Goal",
          data: [3.5,3.5,3.5,3.5],
          borderWidth: 1,
          borderColor: 'rgb(236, 3, 3)',
          backgroundColor: 'rgb(236, 3, 3)',
          type: 'line',
          fill: false
        }
      ]
      $scope.wrs_series = [];
      for(var k in pre_data) {
        $scope.wrs_series.push(series[k])
        var d = [];
        for(var i=0; i < pre_data[k].length; i++) {
          d.push(pre_data[k][i]);
          d.push(post_data[k][i]);
        }
        $scope.wrs_data.push(d.slice());
      }
      console.log($scope.wrs_data, $scope.wrs_series, $scope.wrs_labels);
    }
  , function(error) {
      console.log(error);
  })
});