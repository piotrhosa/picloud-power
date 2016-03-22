angular.module('app')
.directive("heatmap", function($window, $interval) {
    return{
        restrict: "EA",
        template: "<div id='chart'></div>",
        link: function(scope, elem, attrs){

            var d3 = $window.d3;
            var dataToPlot = scope[attrs.mapData];
            var radius = 100, width = 100, height_rad = 35, padding = 5, cols = 2, chartWidth = 0;

            //Call function updating data in chart
            $interval(updateChart, 1000);

            function selectThis(d) {
                d3.select(this).classed('selected', function() {return !d3.select(this).classed('selected');})
            }

            function updateChart() {
                dataToPlot.forEach(function(node) {
                    d3.select('#chart')
                    .selectAll('#entity-' + node.nodeName)
                    .transition()
                    .duration(1000)
                    .style('background-color', node.color)
                    .style('color', node.fontColor);

                    d3.select('#chart')
                    .selectAll('#entity-load-' + node.nodeName)
                    .transition()
                    .duration(1000)
                    .text(function(d) {return String(node.cpu_load) + "% CPU";})

                    d3.select('#chart')
                    .selectAll('#entity-power-' + node.nodeName)
                    .transition()
                    .duration(1000)
                    .text(function(d) {if(node.power > 0){return "Power: " + d3.format('.06f')(node.power) + ' W';}
                                        else {return ""}})
                });
            }

            function positionNodes() {
                chartWidth = angular.element(document.querySelectorAll("ul.nav.nav-tabs")[0])[0].clientWidth;

                var nodes = d3.select('#chart')
                .selectAll('div.node')
                .data(dataToPlot)
                .transition()
                .duration(1000)
                .style('left', function(d, i) {
                    var middle = chartWidth !== 0 ? chartWidth / 2 - (radius + padding) * 2 : 0;
                    var col = i % cols;
                    var x = 2 * col * (radius + padding) + middle;
                    return x + 'px';
                })
                .style('top', function(d, i) {
                    var row = Math.floor(i / cols);
                    var y = 2 * row * (height_rad + padding);
                    return y + 'px';
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
            .style('width', 2 * radius + 'px');

            nodes
            .append('div')
            .attr('id', function(d) {return 'entity-load-' + d.nodeName;})
            .classed('load', true)
            .text(function(d) {return String(d.cpu_load) + "% CPU";})
            .style('width', 2 * radius + 'px');

            nodes
            .append('div')
            .attr('id', function(d) {return 'entity-power-' + d.nodeName;})
            .classed('power', true)
            .text(function(d) {return "";})
            .style('width', 2 * radius + 'px');

            positionNodes();
        }
    };
});
