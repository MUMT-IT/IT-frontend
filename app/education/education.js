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
  $scope.wrs_chart_options = {
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
  var post = [false, true];
  var pre_data = {'knowledge': [], 'prof_skill': [], 'analysis': [],
                  'creativity': [], 'socialresp': [], 'leadership': []};
  var post_data = {'knowledge': [], 'prof_skill': [], 'analysis': [],
                  'creativity': [], 'socialresp': [], 'leadership': []};
  var series = {'knowledge': 'ความรู้', 'prof_skill': 'ทักษะในวิชาชีพ',
                'creativity': 'ความคิดสร้างสรรค์',
                'analysis': 'การคิดวิเคราะห์', 'leadership': 'ภาวะผู้นำ',
                'socialresp': 'การมุ่งช่วยเหลือสังคม'};
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
  $http.get('http://localhost:5000/api/wrs/results/development/').then(function(response) {
      $scope.wrs_data_source = response.data;
      $scope.wrs_data = [];
      $scope.wrs_labels = [];
      for(var i=0; i < $scope.wrs_data_source['data'].length; i++) {
        var year = $scope.wrs_data_source['data'][i]['year'];
        $scope.wrs_labels.push(year+'-ก่อน');
        $scope.wrs_labels.push(year+'-หลัง');
        var res = $scope.wrs_data_source['data'][i]['results'];
        for(var j=0; j < res.length; j++) {
          var item = res[j];
          if(item['post']) {
            post_data[item['question']].push(item['value']);
          } else {
            pre_data[item['question']].push(item['value']);
          }
        }
      }
      for(var k in pre_data) {
        $scope.wrs_series.push(series[k])
        var d = [];
        for(var i=0; i < pre_data[k].length; i++) {
          d.push(pre_data[k][i]);
          d.push(post_data[k][i]);
        }
        $scope.wrs_data.push(d.slice());
      }
    });
  $http.get('http://localhost:5000/api/wrs/results/teaching/').then(function(response) {
    var years = [];
    var series = {'knowledge': 'ความรู้', 'prof_skill': 'ทักษะในวิชาชีพ',
                  'creativity': 'ความคิดสร้างสรรค์',
                  'analysis': 'การคิดวิเคราะห์', 'leadership': 'ภาวะผู้นำ',
                  'socialresp': 'การมุ่งช่วยเหลือสังคม'};
    var data = {};
    var methods = [];
    for(var i=0; i < response.data.data.length; i++) {
      var year = response.data.data[i].year;
      years.push(year);
      data[year] = {};
      for(var j=0; j < response.data.data[i].results.length; j++) {
        var method = response.data.data[i].results[j].method;
        if(methods.indexOf(method) === -1)
          methods.push(method);
        data[year][method] = response.data.data[i].results[j].results;
      }
    }
    $scope.wrs_teaching_chart_data = {};
    for(var m=0; m < methods.length; m++) {
      var method = methods[m];
      var temp_data = [];
      $scope.wrs_teaching_series = [];
      for(var y=0; y < years.length; y++) {
        var t = [];
        for(var i=0; i < data[years[y]][method].length; i++) {
          var item = data[years[y]][method][i];
          t.push(item.value);
          if($scope.wrs_teaching_series.indexOf(series[item.question]) === -1)
            $scope.wrs_teaching_series.push(series[item.question]);
        }
        temp_data.push(t.slice());
      }
      $scope.wrs_teaching_chart_data[method] = [];
      for(var j=0; j < temp_data[0].length; j++) {
        t = [];
        for(var i=0; i < temp_data.length; i++) {
          t.push(temp_data[i][j])
        }
        $scope.wrs_teaching_chart_data[method].push(t.slice());
      }
    }
    $scope.wrs_teaching_labels = years;
  }, function(error) {
    console.log(error);
  })
});