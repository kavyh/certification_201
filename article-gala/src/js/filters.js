/* Directives */

var appFilters = angular.module('appFilters', []);
appFilters.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    };
});

appFilters.filter('pagination', function () {
    return function (input, start) {
        start = +start;
        return input.slice(start);
    };
});