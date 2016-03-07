'use strict';

/**
* @ngdoc overview
* @name app
* @description
* # app
*
* Main module of the application.
*/

//var pi_addr = '192.168.1.134';
var pi_addr = '192.168.0.13';
angular
.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'nvd3',
    'ui.bootstrap',
    'chroma.angularChroma'
])
.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
    })
    .when('/help', {
        templateUrl: 'views/help.html',
        controller: 'HelpCtrl',
        controllerAs: 'main'
    })
    .otherwise({
        redirectTo: '/'
    });
});
