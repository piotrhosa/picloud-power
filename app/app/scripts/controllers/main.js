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

    $scope.rates = ['10', '5'];
    $scope.selected_rate = {'sel':'10'};

    $scope.selections = ['Cluster', 'Master', 'Minion'];
    $scope.selected = {'sel':'Cluster'};
    var rate_int = 0.0;

    $scope.series = ['Cluster', 'Master', 'Minion'];
    $scope.labels = ['A', 'B', 'C'];
    $scope.data = [[1, 4,2], [3, 4, 1]];

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

    $scope.changeRate = function() {
        $scope.rate_int = parseFloat(1.0 / parseFloat($scope.selected_rate.sel));
        var data = {"rate":rate_int}
        $http.post("http://raspberrypi:5000/api/config", data)
        .then(function (response) {
            console.log(response);
        }, function(response) {
            console.log("Error calling API");
        });
    }

    $scope.formatNumber = function(i) {
        return Math.round(i * 100)/100;
    }

    $interval(getRecentSamples, 2000);

    function getRecentSamples() {

        $http.get("http://raspberrypi:5000/api/powersample")
        .then(function (response) {
            $scope.samples = response.data.objects;

            console.log($scope.samples);
        }, function(response) {
            console.log("Error calling API");
        });
    }

    function extractData(samples) {
        for(var i = 0; i < samples.length; ++i) {
            if(samples[i].targetId === "Cluster") {

            }
            else {
                console.log("not found");
            }
        }
    }

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
}]);
