
/* Directives */

var appDirectives = angular.module('appDirectives', []);
/**
 * directive inside html content is not working & the plugin is not allowing any aditional attributes to the html element
 * 
 * @param {type} param1
 * @param {type} param2
 */
appDirectives.directive('lightBoxDirective',['$compile', function ($compile) {
    return {
        restrict: 'C',
        scope: {
            src: "="
        },
        link: function (scope, element, attrs) {
            var result = attrs.src;
            var data = '<p class="ng-scope"><a ng-click="vm.openLightboxModal(\'' + result + '\')"><img src=\'' + result + '\' width="388" height="159"/></a></p>';

            element[0].outerHTML = data;
            element.bind('click', function () {
                console.log('clicked');
            });
            
            $compile(element.contents())(scope);
            
        }
    };
}]);
/**
 * As ng-bind-html is not evaluating the inner directive this compiler is used instead of that
 */
appDirectives.directive('compile', ['$compile', function ($compile) {
        return function (scope, element, attrs) {
            scope.$watch(
                    function (scope) {
                        return scope.$eval(attrs.compile);
                    },
                    function (value) {
                        element.html(value);
                        $compile(element.contents())(scope);
                    }
            );
        };
    }]);