'use strict';

/**
* @ngdoc function
* @name appApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the appApp
*/

angular.module('app').service('HeatmapService', function(){
   this.heatmapData = [
       {
           "nodeName": "pi1",
           "temperature": 0.0,
           "color": "#D9DBDB",
           "cpuLoad": 0.0,
           "power": 0.0
       },
       {
           "nodeName": "pi2",
           "temperature": 0.0,
           "color": "#6DCFFF",
           "cpuLoad": 0.0,
           "power": 0.0
       },
       {
           "nodeName": "pi3",
           "temperature": 0.0,
           "color": "#FDFF7A",
           "cpuLoad": 0.0,
           "power": 0.0
       },
       {
           "nodeName": "pi4",
           "temperature": 0.0,
           "color": "#FF8C6F",
           "cpuLoad": 0.0,
           "power": 0.0
       },
       {
           "nodeName": "pi5",
           "temperature": 0.0,
           "color": "#FF6A5D",
           "cpuLoad": 0.0,
           "power": 0.0
       },
       {
           "nodeName": "pi6",
           "temperature": 0.0,
           "color": "#E88953",
           "cpuLoad": 0.0,
           "power": 0.0
       },
       {
           "nodeName": "pi7",
           "temperature": 0.0,
           "color": "#FF8C6F",
           "cpuLoad": 0.0,
           "power": 0.0
       },
       {
           "nodeName": "pi8",
           "temperature": 0.0,
           "color": "#FF8C6F",
           "cpuLoad": 0.0,
           "power": 0.0
       },
       {
           "nodeName": "pi9",
           "temperature": 0.0,
           "color": "#FF8C6F",
           "cpuLoad": 0.0,
           "power": 0.0
       },
       {
           "nodeName": "pi10",
           "temperature": 0.0,
           "color": "#FF8C6F",
           "cpuLoad": 0.0,
           "power": 0.0
       },
       {
           "nodeName": "pi11",
           "temperature": 0.0,
           "color": "#FF8C6F",
           "cpuLoad": 0.0,
           "power": 0.0
       },
       {
           "nodeName": "pi12",
           "temperature": 0.0,
           "color": "#FF8C6F",
           "cpuLoad": 0.0,
           "power": 0.0
       },
       {
           "nodeName": "pi13",
           "temperature": 0.0,
           "color": "#FF8C6F",
           "cpuLoad": 0.0,
           "power": 0.0
       },
       {
           "nodeName": "pi14",
           "temperature": 0.0,
           "color": "#FF8C6F",
           "cpuLoad": 0.0,
           "power": 0.0
       }];
});

angular.module('app').controller('HeatmapCtrl', function($scope, HeatmapService){
    $scope.heatmapData = HeatmapService.heatmapData;
    });

    angular.module('app').controller('CSVCtrl', function ($scope, $log, $interval, $http) {
        $scope.startTime = new Date();
        $scope.finishTime = new Date($scope.startTime.getTime() + 50000)
        $scope.timestampStart = $scope.startTime.getTime();
        $scope.timestampFinish = $scope.finishTime.getTime();
        $scope.jobDuration = $scope.timestampFinish - $scope.timestampStart

        $scope.hstep = 1;
        $scope.mstep = 5;

        $scope.jobRunning = false;
        $scope.jobProgress = 0;
        $scope.jobCompleted = false;

        $scope.userEmail = null;

        $scope.mode = "power";
        $scope.target = "all";

        $scope.powerSource = false;
        $scope.cpuSource = false;

        $scope.$watch("startTime", function(newValue, oldValue) {
            $scope.timestampStart = newValue.getTime();
        });

        $scope.$watch("finishTime", function(newValue, oldValue) {
            $scope.timestampFinish = newValue.getTime();
        });

        $scope.$watch("mode", function(newValue, oldValue) {
            $scope.powerSource = newValue === 'power' ? true : false;
            $scope.cpuSource = newValue === 'cpu' ? true : false;
        });

        $interval(updateProgress, 1000);

        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        function updateProgress() {
            if($scope.jobRunning === false) return;
            var timestampNow = new Date().getTime();
            var progress = Math.round((timestampNow - $scope.timestampStart) / ($scope.jobDuration) * 100);
            var done = progress >= 100 ? true : false;
            $scope.jobProgress = done ? 100 : progress;
            if(done){
                $scope.jobRunning = false;
                $scope.jobProgress = 0;
                $scope.jobCompleted = true;
            }
        };

        $scope.submitJob = function() {

            var subject = "Your CSV Job is Ready";
            var message = null;
            var target = $scope.target !== 'all' ? $scope.target : null;

            $scope.jobRunning = true;
            var sample = {'email':$scope.userEmail, 'start':$scope.timestampStart, 'finish':$scope.timestampFinish, 'mode':$scope.mode, 'subject':subject, 'message':message, 'target':target};
            console.log(sample);
            console.log($scope.finishTime);

            $http.get("http://" + pi_addr + ":5000/api/csv/" + JSON.stringify(sample))
            .then(function (response) {
                console.log(response.data);
            }, function(response) {
                console.log("Error calling API");
            });
        }

        $scope.changedStart = function () {
            $log.log('Time changed to: ' + $scope.mytime);
        };

        $scope.changedFinish = function() {

        };

        $scope.cancelJob = function() {
            $scope.jobRunning = false;
        };

    });

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
                type: 'lineChart',
                height: 200,
                margin : {
                    top: 20,
                    right: 80,
                    bottom: 40,
                    left: 80
                },
                color: d3.scale.category10().range(),
                x: function(d){ return d.timestamp; },
                y: function(d){ return d.avg_voltage; },
                useInteractiveGuideline: true,
                duration: 0,
                xScale: d3.time.scale.utc(),
                xAxis: {
                    axisLabel: 'Time',
                    rotateLabels: 0,
                    tickFormat: function (d) {return d3.time.format('%X')(new Date(d))},
                    showMaxMin: false,
                },
                yAxis: {
                    axisLabel: 'Voltage (v)',
                    tickFormat: function(d){return d3.format('.04f')(d);}
                }
            }
        };

        $scope.options1 = {
            chart: {
                type: 'lineChart',
                height: 200,
                margin : {
                    top: 20,
                    right: 80,
                    bottom: 40,
                    left: 80
                },
                color: d3.scale.category10().range(),
                x: function(d){ return d.timestamp; },
                y: function(d){ return d.temperature; },
                useInteractiveGuideline: true,
                duration: 0,
                xScale: d3.time.scale.utc(),
                xAxis: {
                    axisLabel: 'Time',
                    rotateLabels: 0,
                    tickFormat: function (d) {return d3.time.format('%X')(new Date(d))},
                    showMaxMin: false,
                },
                yAxis: {
                    axisLabel: 'Temperature (C)',
                    tickFormat: function(d){return d3.format('.02f')(d);}
                }
            }
        };
        $scope.options2 = {
            chart: {
                type: 'lineChart',
                height: 200,
                margin : {
                    top: 20,
                    right: 80,
                    bottom: 40,
                    left: 80
                },
                color: d3.scale.category10().range(),
                x: function(d){ return d.timestamp; },
                y: function(d){ return d.avg_current; },
                useInteractiveGuideline: true,
                duration: 0,
                xScale: d3.time.scale.utc(),
                xAxis: {
                    axisLabel: 'Time',
                    rotateLabels: 0,
                    tickFormat: function (d) {return d3.time.format('%X')(new Date(d))},
                    showMaxMin: false,
                },
                yAxis: {
                    axisLabel: 'Current (I)',
                    tickFormat: function(d){return d3.format('.02f')(d);}
                }
            }
        };
        $scope.options3 = {
            chart: {
                type: 'lineChart',
                height: 200,
                margin : {
                    top: 20,
                    right: 80,
                    bottom: 40,
                    left: 80
                },
                color: d3.scale.category10().range(),
                x: function(d){ return d.timestamp; },
                y: function(d){ return d.avg_power; },
                useInteractiveGuideline: true,
                duration: 0,
                xScale: d3.time.scale.utc(),
                xAxis: {
                    axisLabel: 'Time',
                    rotateLabels: 0,
                    tickFormat: function (d) {return d3.time.format('%X')(new Date(d))},
                    showMaxMin: false,
                },
                yAxis: {
                    axisLabel: 'Power (W)',
                    tickFormat: function(d){return d3.format('.02f')(d);}
                }
            }
        };

        $scope.options4 = {
            chart: {
                type: 'lineChart',
                height: 200,
                margin : {
                    top: 20,
                    right: 80,
                    bottom: 40,
                    left: 80
                },
                color: d3.scale.category10().range(),
                x: function(d){ return d.timestamp; },
                y: function(d){ return d.cpu_load; },
                useInteractiveGuideline: true,
                duration: 0,
                xScale: d3.time.scale.utc(),
                xAxis: {
                    axisLabel: 'Time',
                    rotateLabels: 0,
                    tickFormat: function (d) {return d3.time.format('%X')(new Date(d))},
                    showMaxMin: false,
                },
                yAxis: {
                    axisLabel: 'CPU load (%)',
                    tickFormat: function(d){return d3.format('.02f')(d);}
                }
            }
        };

        $scope.data =
        [{values: [], key: 'Cluster (V)', yAxis: 1, type: 'line', chart: 1},
        {values: [], key: 'Master (V)', yAxis: 1, type: 'line', chart: 1},
        {values: [], key: 'Minion (V)', yAxis: 1, type: 'line', chart: 1}]

        $scope.data1 =
        [{values: [], key: 'Minion (T)', type: 'line', chart: 2}]

        $scope.run = true;

        $scope.toggleRun = function() {$scope.run = ! $scope.run;}

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
            $http.put("http://" + pi_addr + ":5000/api/config",data1)
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

            console.log($scope.run);

            if(!$scope.run) return;

            console.log("Sampling...");

            var order = {"order_by": [{"field": "timestamp", "direction": "desc"}]};
            var filters = {"name": "timestamp", "op": "gt", "val": 0}
            var orderStr = "?q=" + JSON.stringify(order);

            $http.get("http://" + pi_addr + ":5000/api/powersample" + orderStr)
            .then(function (response) {
                $scope.incomingSamples = response.data.objects;
                extractData($scope.incomingSamples);
            }, function(response) {
                console.log("Error calling API");
            });

            var order1 = {"order_by": [{"field": "timestamp", "direction": "desc"}]};
            var filters1 = {"name": "timestamp", "op": "gt", "val": 0}
            var orderStr1 = "?q=" + JSON.stringify(order);

            $http.get("http://" + pi_addr + ":5000/api/cpusample" + orderStr1)
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
                    $scope.samples.push(current);
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
            if($scope.samples.length > 60){ var diff = $scope.samples.length - 50; $scope.samples.splice(0,diff);}
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

            console.log($scope.data[0].values);
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
