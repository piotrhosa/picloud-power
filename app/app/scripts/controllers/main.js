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

    var sampleSet = new Set();
    var sampleSet1 = new Set();
    var largestTimestamp = 0;
    var largestTimestamp1 = 0;

    $scope.rates = ['10', '5'];
    $scope.selected_rate = {'sel':'10'};

    $scope.selections = ['Cluster', 'Master', 'Minion'];
    $scope.selected = {'sel':'Cluster'};
    var rate_int = 0.0;
    $scope.per_sec = " per second";
    $scope.samples = [];

    $scope.options = {
        chart: {
            type: 'multiChart',
            height: 400,
            margin : {
                top: 20,
                right: 80,
                bottom: 40,
                left: 80
            },
            color: d3.scale.category10().range(),
            x: function(d){ return d.timestamp; },
            y: function(d){ var ret = 0;
                if(d.yAxis === 1){
                    ret = d.avg_voltage;
                }
                else if(d.yAxis === 2){
                    ret = d.avg_current;
                }
                return ret; },
            useInteractiveGuideline: true,
            duration: 0,
            xScale: d3.time.scale.utc(),
            xAxis: {
                axisLabel: 'Time',
                rotateLabels: 0,
                tickFormat: function (d) {return d3.time.format('%X')(new Date(d))},
                showMaxMin: false,
            },
            yAxis1: {
                axisLabel: 'Voltage (v)',
                tickFormat: function(d){return d3.format('.04f')(d);}
            },
            yAxis2: {
                axisLabel: 'Current (I)',
                tickFormat: function(d){return d3.format('.04f')(d);}
            }
        }
    };

    $scope.options1 = {
        chart: {
            type: 'multiChart',
            height: 400,
            margin : {
                top: 20,
                right: 80,
                bottom: 40,
                left: 80
            },
            color: d3.scale.category10().range(),
            x: function(d){ return d.timestamp; },
            y: function(d){ var ret = 0;
                if(d.yAxis === 1){
                    ret = d.temperature;
                }
                else if(d.yAxis === 2){
                    ret = d.cpu_load;
                }
                return ret; },
            useInteractiveGuideline: true,
            duration: 0,
            xScale: d3.time.scale.utc(),
            xAxis: {
                axisLabel: 'Time',
                rotateLabels: 0,
                tickFormat: function (d) {return d3.time.format('%X')(new Date(d))},
                showMaxMin: false,
            },
            yAxis1: {
                axisLabel: 'Temperature (C)',
                tickFormat: function(d){return d3.format('.02f')(d);}
            },
            yAxis2: {
                axisLabel: 'CPU load (%)',
                tickFormat: function(d){return d3.format('.02f')(d);}
            }
        }
    };

    $scope.data =
    [{values: [], key: 'Cluster (V)', yAxis: 1, type: 'line', chart: 1},
    {values: [], key: 'Master (V)', yAxis: 1, type: 'line', chart: 1},
    {values: [], key: 'Minion (V)', yAxis: 1, type: 'line', chart: 1},
    {values: [], key: 'Cluster (I)', yAxis: 2, type: 'line', chart: 1},
    {values: [], key: 'Master (I)', yAxis: 2, type: 'line', chart: 1},
    {values: [], key: 'Minion (I)', yAxis: 2, type: 'line', chart: 1}]

    $scope.data1 =
    [{values: [], key: 'Minion (T)', yAxis: 1, type: 'line', chart: 2},
    {values: [], key: 'Minion (%CPU)', yAxis: 2, type: 'line', chart: 2}]

    $scope.run = true;

    $scope.$watch('run', function(newValue, oldValue) {
        $scope.buttonValue = $scope.run === true ? "Freeze" : "Run";
    });

    $scope.incomingSamples = [
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

    $scope.incomingSamples1 = [
        {
            target_id: "null",
            timestamp: "null",
            temperature: "null",
            cpu_load: "null"
        }
    ];

    $scope.changeRate = function() {
        $scope.rate_int = parseFloat(1.0 / parseFloat($scope.selected_rate.sel));
        var data1 = $.param({
            rate: $scope.rate_int,
            id: "2"
        });
        $http.put("http://raspberrypi:5000/api/config",data1)
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

        console.log("Sampling...");

        var order = {"order_by": [{"field": "timestamp", "direction": "desc"}]};
        var filters = {"name": "timestamp", "op": "gt", "val": 0}
        var orderStr = "?q=" + JSON.stringify(order);

        $http.get("http://raspberrypi:5000/api/powersample" + orderStr)
        .then(function (response) {
            $scope.incomingSamples = response.data.objects;
            extractData($scope.incomingSamples);
        }, function(response) {
            console.log("Error calling API");
        });

        var order1 = {"order_by": [{"field": "timestamp", "direction": "desc"}]};
        var filters1 = {"name": "timestamp", "op": "gt", "val": 0}
        var orderStr1 = "?q=" + JSON.stringify(order);

        $http.get("http://raspberrypi:5000/api/cpusample" + orderStr1)
        .then(function (response) {
            $scope.incomingSamples1 = response.data.objects;
            extractData1($scope.incomingSamples1);
        }, function(response) {
            console.log("Error calling API");
        });
    }

    var more = 0;

    function extractData(samples) {
        for(var i = 0; i < samples.length; ++i) {

            var current = samples[i];
            var date = new Date(current.timestamp);
            current.date = date;
            current.formattedDate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds();

            if(sampleSet.has(current)) {

            }
            else {
                if(current.timestamp > largestTimestamp) largestTimestamp = current.timestamp;
                sampleSet.add(current);
                insertSample(current);
            }

        }
        $scope.data[0].values.sort(function(a, b) {return parseFloat(a.timestamp) - parseFloat(b.timestamp);});
        if($scope.data[0].values.length > 50){ var diff = $scope.data[0].values.length - 50; $scope.data[0].values.splice(0,diff);}
        $scope.data[0].values.forEach(function(a){a.yAxis = 1});
        $scope.data[1].values.sort(function(a, b) {return parseFloat(a.timestamp) - parseFloat(b.timestamp);});
        if($scope.data[1].values.length > 50){var diff = $scope.data[1].values.length - 50; $scope.data[1].values.splice(0,diff);}
        $scope.data[1].values.forEach(function(a){a.yAxis = 1});
        $scope.data[2].values.sort(function(a, b) {return parseFloat(a.timestamp) - parseFloat(b.timestamp);});
        if($scope.data[2].values.length > 50) {var diff = $scope.data[2].values.length - 50; $scope.data[2].values.splice(0,diff);}
        $scope.data[2].values.forEach(function(a){a.yAxis = 1});
        $scope.data[3].values = $scope.data[0].values.slice(0);
        $scope.data[3].values.forEach(function(a){a.yAxis = 2});
        $scope.data[4].values = $scope.data[1].values.slice(0);
        $scope.data[4].values.forEach(function(a){a.yAxis = 2});
        $scope.data[5].values = $scope.data[2].values.slice(0);
        $scope.data[5].values.forEach(function(a){a.yAxis = 2});
    }

    function extractData1(samples) {
        for(var i = 0; i < samples.length; ++i) {

            var current = samples[i];
            var date = new Date(current.timestamp);
            current.date = date;
            current.formattedDate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds();

            if(sampleSet1.has(current)) {

            }
            else {
                if(current.timestamp > largestTimestamp1) largestTimestamp1 = current.timestamp;
                sampleSet1.add(current);
                insertSample1(current);
                $scope.samples.push(current);
            }

        }
        $scope.data1[0].values.sort(function(a, b) {return parseFloat(a.timestamp) - parseFloat(b.timestamp);});
        if($scope.data1[0].values.length > 50){ var diff = $scope.data1[0].values.length - 50; $scope.data1[0].values.splice(0,diff);}
        $scope.data1[0].values.forEach(function(a){a.yAxis = 1});
        $scope.data1[1].values = $scope.data1[0].values;
        $scope.data1[1].values.forEach(function(a){a.yAxis = 2});

        console.log($scope.data1[0].values);
    }


    function insertSample(current) {

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

    function insertSample1(current) {

        switch(current.target_id) {
            case "minion":
            $scope.data1[0].values.push(current);
            break;
            default:
            console.error("Sample not recognized.");
            break;
        }
    }
}]);
