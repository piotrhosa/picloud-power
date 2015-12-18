'use strict';

/**
* @ngdoc function
* @name appApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the appApp
*/
angular.module('app')
.controller('MainCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

    $scope.selections = ['Cluster', 'Master', 'Minion'];
    $scope.selected = {'sel':'Cluster'};

    $scope.samples = [
        {
            target_id: "null",
            energy: "null",
            time: "null",
            power: "null",
            peak_power: "null",
            peak_current: "null",
            peak_voltage: "null"
        }
    ];

    $scope.formatNumber = function(i) {
        return Math.round(i * 100)/100;
    }

    $interval(getRecentSamples, 2000);

    function getRecentSamples() {

        $http.get("http://192.168.0.13:5000/api/powersample")
        .then(function (response) {
            $scope.samples = response.data.objects;
            console.log("Received response.");
        });

        console.log("call...");
    }
}]);
