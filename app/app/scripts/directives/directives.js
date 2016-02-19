angular.module('app')
.directive("heatmap", function($window) {
    return{
        restrict: "EA",
        template: "<div id='chart'></div>",
        link: function(scope, elem, attrs){

            var d3 = $window.d3;
            var dataToPlot = scope[attrs.mapData];
            var radius = 100, width = 100, height_rad = 35, padding = 5, cols = 2, parameter = 'RecId';

            function SVG(x, y) {
                return 'translate('+x+','+y+')';
            }

            function selectThis(d) {
                d3.select(this).classed('selected', function() {return !d3.select(this).classed('selected');})
            }

            function updateChart() {

                var nodes = d3.select('#chart')
                .selectAll('div.node')
                .sort(function(a, b) {return parameter === 'ranking' ? d3.ascending(a[parameter], b[parameter]) : d3.descending(a[parameter], b[parameter]);})
                .transition()
                .duration(1000)
                .style('left', function(d, i) {
                    var col = i % cols;
                    var x = 2 * col * (radius + padding);
                    return x + 'px';
                })
                .style('top', function(d, i) {
                    var row = Math.floor(i / cols);
                    var y = 2 * row * (height_rad + padding);
                    return y + 'px';
                });

                d3.select('#chart')
                .selectAll('div.node .value')
                .transition()
                .duration(1000)
                .tween("text", function(d)
                {
                    var x = d[parameter];
                    if (!(parameter == 'RecId' || parameter == 'EntId')) x *= 10000;
                    var i = d3.interpolate(this.textContent, (x));
                    return function(t) {
                        this.textContent = Math.round(i(t));
                    };
                });
            }

            var nodes = d3.select('#chart')
            .selectAll('div')
            .data(dataToPlot)
            .enter()
            .append('div')
            .attr('id', function(d) {return 'entity-'+d.nodeName;})
            .classed('node', true)
            .style('width', 2 * radius + 'px')
            .style('height', 2 * height_rad + 'px')
            .style('background-color', function(d){return d.color})
            .on('click', selectThis);

            nodes
            .append('div')
            .classed('name', true)
            .text(function(d) {return d.nodeName;})
            .style('width', 2 * radius + 'px')
            .style('height', 5 + 'px');

            nodes
            .append('div')
            .classed('value', true)
            .text(function(d) {return 0;})
            .style('width', 2 * radius + 'px');

            updateChart();
        }
    };
});
