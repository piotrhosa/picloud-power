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
    this.rangeMax = 55;

    this.noIncomingCPUData = function() {
        console.log("no incoming CPU");
        this.heatmapData.forEach(function(node) {
            node.color = "#D3D3D3";
            node.temperature = 0.0;
            node.cpu_load = 0.0;
            node.fontColor = '#808080';
        });
    }

    this.noIncomingPowerData = function() {
        console.log("No incoming power");
        this.heatmapData.forEach(function(node) {
            node.power = 0.0;
        });
    }

    this.getColorDiscrete = function(temp) {
        var percentRange = (temp - this.rangeMin) / (this.rangeMax - this.rangeMin);

        if(percentRange <= 0) {
            return this.range[0];
        } else if(percentRange >= 1) {
            return this.range[9];
        } else {
            return this.range[Math.round(percentRange * 10)];
        }
    }

    this.getColorCont = function(temp) {
        var percentRange = (temp - this.rangeMin) / (this.rangeMax - this.rangeMin);
        var hueRange = (1.0 - percentRange);
        var hslColor = "";
        var hue = 0;

        if(percentRange <= 0) {
            hue = hueRange * 240;
            hslColor =  "hsl(240, 100%, 70%)";
        } else if(percentRange >= 1) {
            hue = hueRange * 240;
            hslColor = "hsl(0, 100%, 70%)";
        } else {
            hue = hueRange * 240;
            hslColor = "hsl(" + hue + ", 100%, 70%)";
        }

        return {'hslColor': hslColor, 'hue': hue};
    }

    this.updateCPU = function(name, temperature, cpu_load) {
        var target = this.heatmapData.find(function (d) {
            return d.nodeName === name;
        });
        var colorData = this.getColorCont(temperature);
        target.color = colorData.hslColor;
        target.hue = colorData.hue;
        target.fontColor =  200 > target.hue && target.hue > 30 ? '#808080' : '#ffffff';
        target.temperature = temperature;
        target.cpu_load = cpu_load;
        this.notifyObservers();
    }

    this.updatePower = function(name, power) {
        var target = this.heatmapData.find(function (d) {
            return d.nodeName === name;
        });
        target.power = power;
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
