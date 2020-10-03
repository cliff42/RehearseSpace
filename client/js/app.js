'use strict';

var app = angular.module('myApp', [
  'ngRoute', 'controllers', 'chart.js'
]);

app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'pages/start.html',
      controller: 'StartCtrl'
    })
    .otherwise('/');
}]);