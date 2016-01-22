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

    $scope.options = {
        chart: {
            type: 'lineChart',
            height: 400,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 70
            },
            x: function(d){ return d.timestamp; },
            y: function(d){ return d.avg_voltage; },
            useInteractiveGuideline: true,
            duration: 0,
            xAxis: {
                axisLabel: 'Time (ms)'
            },
            yAxis: {
                axisLabel: 'Voltage (v)',
                tickFormat: function(d){
                    return d3.format('.01f')(d);
                }
            }
        }
    };

    $scope.data = [{values: [], key: 'Cluster'},
                    {values: [], key: 'Master'},
                    {values: [], key: 'Minion'}];

    $scope.run = true;

    $scope.$watch('run', function(newValue, oldValue) {
        $scope.buttonValue = $scope.run === true ? "Freeze" : "Run";
    });

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
            extractData($scope.samples);
        }, function(response) {
            console.log("Error calling API");
        });
    }

    var more = 0;

    function extractData(samples) {
        for(var i = 0; i < samples.length; ++i) {
            var current = samples[i];
            current.timestamp = current.timestamp + more;
            switch(current.target_id) {
                case "cluster":
                $scope.data[0].values.push(current);
                break;
                case "master":
                $scope.data[1].values.push(current);
                break;
                case "minion":
                $scope.data[2].values.push(current);
                break;
                default:
                console.error("Sample not recognized.");
            }
        }
        $scope.data[0].values.sort(function(a, b) {return parseFloat(a.timestamp) - parseFloat(b.timestamp);});
        console.log("Pushed some new ", more);
        more = more + 100000;
    }

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
}]);
