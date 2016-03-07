'use strict';

/**
* @ngdoc function
* @name appApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the appApp
*/

angular.module('app').controller('HeatmapCtrl', function($scope, HeatmapService){
    $scope.heatmapData = HeatmapService.heatmapData;

    var updateData = function(){
        $scope.heatmapData = HeatmapService.heatmapData;
    };

    HeatmapService.registerObserverCallback(updateData);

    var some = HeatmapService.heatmapData.find(function (d) {
        return d.nodeName === 'pi1';
    });

    var bottomColor = 240;
    var topColor = 0;
    var steps = 100;
    $scope.colorRange = [];
    $scope.colorWidth = 100/steps;
    $scope.rangeMin = HeatmapService.rangeMin;
    $scope.rangeMax = HeatmapService.rangeMax;

    function generateRange() {
        var ret = []
        var colorstep = (bottomColor - topColor)/steps;
        for(var i = 0; i < steps; ++i) {
            ret.push('hsl(' + (bottomColor - i*colorstep) + ', 100%, 70%)');
        }
        $scope.colorRange = ret;
    };

    generateRange();
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
.controller('MainCtrl', ['$scope', '$http', '$interval', 'HeatmapService', function ($scope, $http, $interval, HeatmapService) {

    var sampleSet = new Set();
    var sampleSet1 = new Set();
    var largestTimestamp = 0;
    var largestTimestamp1 = 0;

    $scope.rates = ['10', '5'];
    $scope.selected_rate = {'sel':'10'};

    $scope.selections = ['pi0', 'pi1', 'pi2'];
    $scope.selected = {'sel':'pi0'};
    var rate_int = 0.0;
    $scope.per_sec = " per second";
    $scope.samples = [];

    $scope.mostRecentPowerTimestamp = 0;
    $scope.mostRecentCPUTimestamp = 0;

    //Range visible in graphs in millis
    $scope.timeRange = 60000;

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
            color: d3.scale.category20().range(),
            x: function(d){ return d.timestamp; },
            y: function(d){ return d.avg_voltage; },
            useInteractiveGuideline: true,
            duration: 0,
            noData: 'No voltage data avilable',
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
            color: d3.scale.category20().range(),
            x: function(d){ return d.timestamp; },
            y: function(d){ return d.temperature; },
            useInteractiveGuideline: true,
            duration: 0,
            noData: 'No temperature data avilable',
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
            color: d3.scale.category20().range(),
            x: function(d){ return d.timestamp; },
            y: function(d){ return d.avg_current; },
            useInteractiveGuideline: true,
            duration: 0,
            noData: 'No current data avilable',
            xScale: d3.time.scale.utc(),
            xAxis: {
                axisLabel: 'Time',
                rotateLabels: 0,
                tickFormat: function (d) {return d3.time.format('%X')(new Date(d))},
                showMaxMin: false,
            },
            yAxis: {
                axisLabel: 'Current (mA)',
                tickFormat: function(d){return d3.format('.04f')(d*1000);}
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
            color: d3.scale.category20().range(),
            x: function(d){ return d.timestamp; },
            y: function(d){ return d.avg_power; },
            useInteractiveGuideline: true,
            duration: 0,
            noData: 'No power data avilable',
            xScale: d3.time.scale.utc(),
            xAxis: {
                axisLabel: 'Time',
                rotateLabels: 0,
                tickFormat: function (d) {return d3.time.format('%X')(new Date(d))},
                showMaxMin: false,
            },
            yAxis: {
                axisLabel: 'Power (mW)',
                tickFormat: function(d){return d3.format('.04f')(d*1000);}
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
            color: d3.scale.category20().range(),
            x: function(d){ return d.timestamp; },
            y: function(d){ return d.cpu_load; },
            useInteractiveGuideline: true,
            duration: 0,
            noData: 'No CPU data avilable',
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
    [{values: [], key: 'pi0 (pimaster)', type: 'line'},
    {values: [], key: 'pi1 (minion)', type: 'line'},
    {values: [], key: 'pi2 (minion)', type: 'line'}]

    $scope.data1 =
    [{values: [], key: 'pi0', type: 'line'},
    {values: [], key: 'pi1', type: 'line'},
    {values: [], key: 'pi2', type: 'line'},
    {values: [], key: 'pi3', type: 'line'},
    {values: [], key: 'pi4', type: 'line'},
    {values: [], key: 'pi5', type: 'line'},
    {values: [], key: 'pi6', type: 'line'},
    {values: [], key: 'pi7', type: 'line'},
    {values: [], key: 'pi8', type: 'line'},
    {values: [], key: 'pi9', type: 'line'},
    {values: [], key: 'pi10', type: 'line'},
    {values: [], key: 'pi11', type: 'line'},
    {values: [], key: 'pi12', type: 'line'},
    {values: [], key: 'pi13', type: 'line'}];

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

        if(!$scope.run) return;

        var queryPower = {
            "order_by": [{"field": "timestamp", "direction": "desc"}],
            "filters": [{"name": "timestamp", "op": "gt", "val": $scope.mostRecentPowerTimestamp}]
        };
        var queryStrPower = "?q=" + JSON.stringify(queryPower);
        var ajaxStrPower = "http://" + pi_addr + ":5000/api/powersample" + queryStrPower;

        $http.get(ajaxStrPower)
        .then(function (response) {
            if(!$scope.run) return;
            //if(response.data.total_pages > 1)
            $scope.incomingSamples = response.data.objects;
            extractData($scope.incomingSamples);
            if(response.data.num_results === 0) $scope.data.forEach(function(node){node.values.splice(0, node.values.length)});
        }, function(response) {
            console.log("Error calling API");
            $scope.data.forEach(function(node){node.values.splice(0, node.values.length)});
            HeatmapService.noIncomingPowerData();
        });

        var queryCPU = {
            "order_by": [{"field": "timestamp", "direction": "desc"}],
            "filters": [{"name": "timestamp", "op": "gt", "val": $scope.mostRecentCPUTimestamp}]
        };
        var queryStrCPU = "?q=" + JSON.stringify(queryCPU);
        var ajaxStrCPU = "http://" + pi_addr + ":5000/api/cpusample" + queryStrCPU;

        $http.get(ajaxStrCPU)
        .then(function (response) {
            if(!$scope.run) return;
            $scope.incomingSamples1 = response.data.objects;
            extractData1($scope.incomingSamples1);
            if(response.data.num_results === 0) {
                $scope.data1.forEach(function(node){node.values.splice(0, node.values.length)});
                HeatmapService.noIncomingCPUData();
            }
        }, function(response) {
            console.log("Error calling API");
            $scope.data1.forEach(function(node){node.values.splice(0, node.values.length)});
            HeatmapService.noIncomingCPUData();
        });
    }

    var more = 0;

    function extractData(samples) {
        for(var i = 0; i < samples.length; ++i) {

            var current = samples[i];
            var date = new Date(current.timestamp);
            current.date = date;
            current.formattedDate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds();

            if(!sampleSet.has(current)) {
                if(current.timestamp > largestTimestamp) largestTimestamp = current.timestamp;
                sampleSet.add(current);
                $scope.samples.push(current);
                insertSample(current);
            }
        }

        if($scope.samples.length > 0) {
            var date = new Date().getTime();
            $scope.samples.sort(function(a, b) {return parseFloat(a.timestamp) - parseFloat(b.timestamp);});
            if($scope.samples[0].timestamp + $scope.timeRange < date) {
                var index = 0;
                for(i = 0; i < $scope.samples.length; i++) {
                    if($scope.samples[i].timestamp > date - $scope.timeRange) {
                        index = i;
                        break;
                    }
                }
                $scope.samples.splice(0,index);
            }
        }

        $scope.data.forEach(function(node) {
            var date = new Date().getTime();
            node.values.sort(function(a, b) {return parseFloat(a.timestamp) - parseFloat(b.timestamp);});
            if(node.values[0].timestamp + $scope.timeRange < date) {
                var index = 0
                for(i = 0; i < node.values.length; i++) {
                    if(node.values[i].timestamp > date - $scope.timeRange) {
                        index = i;
                        break;
                    }
                }
                node.values.splice(0,index);
            }
        })

        //if($scope.data[0].values.length > 50){ var diff = $scope.data[0].values.length - 50; $scope.data[0].values.splice(0,diff);}
        //if($scope.data[1].values.length > 50){var diff = $scope.data[1].values.length - 50; $scope.data[1].values.splice(0,diff);}
        //if($scope.data[2].values.length > 50) {var diff = $scope.data[2].values.length - 50; $scope.data[2].values.splice(0,diff);}
        //if($scope.samples.length > 60){ var diff = $scope.samples.length - 50; $scope.samples.splice(0,diff);}

        var mostRecent = $scope.data[0].values[$scope.data[0].values.length - 1];
        $scope.mostRecentPowerTimestamp = mostRecent.timestamp;
        $scope.data.forEach(function(node) {
            var mostRecent = node.values[node.values.length - 1];
            HeatmapService.updatePower(mostRecent.target_id, mostRecent.avg_power);
        })
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

        if($scope.samples.length > 0) {
            var date = new Date().getTime();
            $scope.samples.sort(function(a, b) {return parseFloat(a.timestamp) - parseFloat(b.timestamp);});
            if($scope.samples[0].timestamp + $scope.timeRange < date) {
                var index = 0;
                for(i = 0; i < $scope.samples.length; i++) {
                    if($scope.samples[i].timestamp > date - $scope.timeRange) {
                        index = i;
                        break;
                    }
                }
                $scope.samples.splice(0,index);
            }
        }

        for(var i = 0; i < $scope.data1.length; ++i) {
            var node = $scope.data1[i];
            var date = new Date().getTime();
            node.values.sort(function(a, b) {return parseFloat(a.timestamp) - parseFloat(b.timestamp);});
            if(node.values.length === 0) break;
            if(node.values[0].timestamp + $scope.timeRange < date) {
                var index = 0;
                for(i = 0; i < node.values.length; i++) {
                    if(node.values[i].timestamp > date - $scope.timeRange) {
                        index = i;
                        break;
                    }
                }
                node.values.splice(0,index);
            }
        }

        var mostRecent = $scope.data1[0].values[$scope.data1[0].values.length - 1];
        $scope.mostRecentCPUTimestamp = mostRecent.timestamp;
        for(var i = 0; i < $scope.data1.length; ++i) {
            var node = $scope.data1[i];
            if(node.values.length > 0) {
                var mostRecent = node.values[node.values.length - 1];
                HeatmapService.updateCPU(mostRecent.target_id, mostRecent.temperature, mostRecent.cpu_load);
            }
        }
    }


    function insertSample(current) {

        switch(current.target_id) {
            case "pi0":
            $scope.data[0].values.push(current);
            break;
            case "pi1":
            $scope.data[1].values.push(current);
            break;
            case "pi2":
            $scope.data[2].values.push(current);
            break;
            default:
            console.error("Sample not recognized.");
        }
    }

    function insertSample1(current) {

        switch(current.target_id) {
            case "pi0":
            $scope.data1[0].values.push(current);
            break;
            case "pi1":
            $scope.data1[1].values.push(current);
            break;
            case "pi2":
            $scope.data1[2].values.push(current);
            break;
            case "pi3":
            $scope.data1[3].values.push(current);
            break;
            case "pi4":
            $scope.data1[4].values.push(current);
            break;
            case "pi5":
            $scope.data1[5].values.push(current);
            break;
            case "pi6":
            $scope.data1[6].values.push(current);
            break;
            case "pi7":
            $scope.data1[7].values.push(current);
            break;
            case "pi8":
            $scope.data1[8].values.push(current);
            break;
            case "pi9":
            $scope.data1[9].values.push(current);
            break;
            case "pi10":
            $scope.data1[10].values.push(current);
            break;
            case "pi11":
            $scope.data1[11].values.push(current);
            break;
            case "pi12":
            $scope.data1[12].values.push(current);
            break;
            case "pi13":
            $scope.data1[13].values.push(current);
            break;
            default:
            console.error("Sample not recognized.");
            break;
        }
    }
}]);
