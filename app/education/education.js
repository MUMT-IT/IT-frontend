'use strict';

angular.module('myApp.education', ['ngRoute', 'chart.js'])

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
      $scope.wrs_below_cutoff = [];
      for(var j in post_data) {
        console.log(series[j], post_data[j])
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
  $http.get('http://localhost:5000/api/followup/results/').then(function(response) {
    var empl_data = response.data;
    $scope.empl_labels = [];
    $scope.empl_series = [];
    for(var i=0; i < empl_data.length; i++) {
      if($scope.empl_labels.indexOf(empl_data[i].year) < 0) {
        $scope.empl_labels.push(empl_data[i].year)
      }
      if($scope.empl_series.indexOf(empl_data[i].program.toUpperCase()) < 0) {
        $scope.empl_series.push(empl_data[i].program.toUpperCase())
      }
    }
    $scope.empl_labels.sort(function(a,b) { return parseInt(a) - parseInt(b)})
    $scope.empl_labels.sort(function(a,b) { return a - b})
    $scope.empl_data = [];
    for(var i=0; i < $scope.empl_series.length; i++) {
      var d = [];
      for(var j=0; j < $scope.empl_labels.length; j++) {
        for(var k=0; k < empl_data.length; k++) {
          var item = empl_data[k];
          if($scope.empl_labels[j]===item.year && $scope.empl_series[i]===item.program.toUpperCase())
            d.push((parseFloat(empl_data[k].rate) * 100.0).toFixed(2));
        }
      }
      $scope.empl_data.push(d)
    }
    $scope.empl_chart_options = {
      'elements': {
        'line': {
          'fill': false,
        },
        'point': {
          'radius': 6
        }
      },
      'animation': false,
      'legend': {
        'display': true
      },
      'scales': {
        'yAxes': [{
          'display': true,
          'scaleLabel': {
            'display': true,
            'labelString': 'ร้อยละของผู้สำเร็จการศึกษาที่ได้งานทำหรือศึกษาต่อ',
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
  })
  $http.get('http://localhost:5000/api/evaluation/results/').then(function(response) {
    $scope.eval_results = {};
    var programs = [];
    var years = [];
    var item;
    for(var i=0; i < response.data.length; i++) {
      item = response.data[i];
      if(programs.indexOf(item.program) < 0)
        programs.push(item.program);
      if(years.indexOf(item.year) < 0)
        years.push(item.year);
    }
    programs.sort(function(a,b) { return a - b });
    years.sort(function(a,b) { return parseInt(a) - parseInt(b) });
    $scope.eval_results = [];
    var temp = {};
    for(var k=0; k < years.length; k++) {
      temp['avg_analytics'] = [];
      temp['avg_thinking'] = [];
      temp['avg_relation'] = [];
      temp['avg_professional'] = [];
      temp['avg_morals'] = [];
      temp['avg_identity'] = [];
      temp['avg_overall'] = [];
      temp['avg_knowledge'] = [];
      for(var j=0; j < programs.length; j++) {
        for(var i=0; i < response.data.length; i++) {
          item = response.data[i];
          if(item.year === years[k] && item.program === programs[j]) {
            temp['avg_analytics'].push(item.avg_analytics);
            temp['avg_thinking'].push(item.avg_thinking);
            temp['avg_relation'].push(item.avg_relation);
            temp['avg_professional'].push(item.avg_professional);
            temp['avg_morals'].push(item.avg_morals);
            temp['avg_identity'].push(item.avg_identity);
            temp['avg_overall'].push(item.avg_overall);
            temp['avg_knowledge'].push(item.avg_knowledge);
          }
        }
      }
      $scope.eval_results.push(temp['avg_knowledge'].slice());
      $scope.eval_results.push(temp['avg_professional'].slice());
      $scope.eval_results.push(temp['avg_analytics'].slice());
      $scope.eval_results.push(temp['avg_thinking'].slice());
      $scope.eval_results.push(temp['avg_relation'].slice());
      $scope.eval_results.push(temp['avg_morals'].slice());
      $scope.eval_results.push(temp['avg_identity'].slice());
      $scope.eval_results.push(temp['avg_overall'].slice());
    }
    $scope.eval_series = ['ความรู้', 'ทักษะทางวิชาชีพ', 'การคิดวิเคราะห์',
                      'ทักษะทางปัญญา', 'ความสัมพันธ์กับเพื่อนร่วมงาน',
                      'คุณธรรมจริยธรรม', 'อัตลักษณ์', 'โดยรวม']
    $scope.eval_labels = [];
    for(var i=0; i < years.length; i++) {
      for(var j=0; j < programs.length; j++)
        $scope.eval_labels.push(years[i] + "-" + programs[j])
    }
  })
});