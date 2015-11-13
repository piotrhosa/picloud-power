angular.module('myApp.directives', ['d3'])
.directive('barChart', ['d3Service', function(d3Service) {
    return {
        restrict: 'EA',
        // directive code
    }
}]);
