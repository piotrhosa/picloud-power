'use strict';

/**
* @ngdoc overview
* @name app
* @description
* # app
*
* Main module of the application.
*/
angular
.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'nvd3',
    'ui.bootstrap'
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
