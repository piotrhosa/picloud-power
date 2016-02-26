angular.module('app').service('HeatmapService', function(){

    var observerCallbacks = [];

    this.registerObserverCallback = function(callback){
        observerCallbacks.push(callback);
    };

    this.notifyObservers = function(){
        angular.forEach(observerCallbacks, function(callback){
            callback();
        });
    };

    //Colors obtained from http://colorbrewer2.org/
    this.range = ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
    this.rangeMin = 40;
    this.rangeMax = 46;

    this.getColor = function(temp) {
        var percentRange = (temp - this.rangeMin) / (this.rangeMax - this.rangeMin);

        if(percentRange <= 0) {
            return this.range[0];
        } else if(percentRange >= 1) {
            return this.range[9];
        } else {
            return this.range[Math.round(percentRange * 10)];
        }
    }

    this.changeData = function(name, temperature, cpu_load) {
        var target = this.heatmapData.find(function (d) {
            return d.nodeName === name;
        });
        target.color = this.getColor(temperature);
        target.temperature = temperature;
        target.cpu_load = cpu_load;
        this.notifyObservers();
    }

    this.heatmapData = [
        {
            "nodeName": "pi0",
            "temperature": 0.0,
            "color": "#D3D3D3",
            "cpu_load": 0.0,
            "power": 0.0
        },
        {
            "nodeName": "pi1",
            "temperature": 0.0,
            "color": "#D3D3D3",
            "cpu_load": 0.0,
            "power": 0.0
        },
        {
            "nodeName": "pi2",
            "temperature": 0.0,
            "color": "#D3D3D3",
            "cpu_load": 0.0,
            "power": 0.0
        },
        {
            "nodeName": "pi3",
            "temperature": 0.0,
            "color": "#D3D3D3",
            "cpu_load": 0.0,
            "power": 0.0
        },
        {
            "nodeName": "pi4",
            "temperature": 0.0,
            "color": "#D3D3D3",
            "cpu_load": 0.0,
            "power": 0.0
        },
        {
            "nodeName": "pi5",
            "temperature": 0.0,
            "color": "#D3D3D3",
            "cpu_load": 0.0,
            "power": 0.0
        },
        {
            "nodeName": "pi6",
            "temperature": 0.0,
            "color": "#D3D3D3",
            "cpu_load": 0.0,
            "power": 0.0
        },
        {
            "nodeName": "pi7",
            "temperature": 0.0,
            "color": "#D3D3D3",
            "cpu_load": 0.0,
            "power": 0.0
        },
        {
            "nodeName": "pi8",
            "temperature": 0.0,
            "color": "#D3D3D3",
            "cpu_load": 0.0,
            "power": 0.0
        },
        {
            "nodeName": "pi9",
            "temperature": 0.0,
            "color": "#D3D3D3",
            "cpu_load": 0.0,
            "power": 0.0
        },
        {
            "nodeName": "pi10",
            "temperature": 0.0,
            "color": "#D3D3D3",
            "cpu_load": 0.0,
            "power": 0.0
        },
        {
            "nodeName": "pi11",
            "temperature": 0.0,
            "color": "#D3D3D3",
            "cpu_load": 0.0,
            "power": 0.0
        },
        {
            "nodeName": "pi12",
            "temperature": 0.0,
            "color": "#D3D3D3",
            "cpu_load": 0.0,
            "power": 0.0
        },
        {
            "nodeName": "pi13",
            "temperature": 0.0,
            "color": "#D3D3D3",
            "cpu_load": 0.0,
            "power": 0.0
        }];
    });
