var myapp = angular.module('app');
myapp.factory('HttpService', ['$http', '$q', function ($http, $q) {
        var factory = {
            get: function (endpoint) {
                var deferred = $q.defer();
                $http.get(endpoint).then(function (response) {
                    deferred.resolve(response.data);
                }, function (response) {
                    factory.handleError(response, deferred, endpoint);
                });
                return deferred.promise;
            },
            put: function (endpoint, data, config) {
                var deferred = $q.defer();
                $http({
                    method: 'PUT',
                    url: endpoint,
                    data: data
                }, config).then(function (response) {
                    deferred.resolve(response.data);
                }, function (response) {
                    factory.handleError(response, deferred, endpoint);
                });
                return deferred.promise;
            },
            delete: function (endpoint) {
                var deferred = $q.defer();
                $http.delete(endpoint).then(function (response) {
                    deferred.resolve(response);
                }, function (response) {
                    factory.handleError(response, deferred, endpoint);
                });
                return deferred.promise;
            },
            post: function (endpoint, data, config) {
                var deferred = $q.defer();
                $http.post(endpoint, data, config).then(function (response) {
                    deferred.resolve(response.data);
                }, function (response) {
                    factory.handleError(response, deferred, endpoint);
                });
                return deferred.promise;
            },
            handleError: function (response, deferred, endpoint) {
                if (response.data && response.status !== 500) {
                    if (response.data.message) {
                        console.log(response.data.message);
                    }
                    deferred.reject(response);
                } else {
                    console.log("Oops, something wrong happened. Please refresh the page.");
                    response.data = {};
                    deferred.reject(response);
                }
            }
        };
        return factory;
    }]);
myapp.factory('AuthService',['$http', '$rootScope', '$cookies', 'HttpService', function ($http, $rootScope, $cookies, HttpService) {
    var service = {};
    service.Login = function (username, password, callback) {
        HttpService.post('/auth/authenticate', {username: username, password: password})
                .then(function (response) {
                    // login successful if there's a token in the response
                    if (response.token) {
                        // store username and token in local storage to keep user logged in between page refreshes
                        $cookies.putObject('article.user', response, {
                            expires: new Date(new Date().getTime() + 1000 * 24 * 3600 * 60) // remember 60 days
                        });
                        $rootScope.currentUser = response;
                        // add jwt token to auth header for all requests made by the $http service
                        $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;

                        // execute callback with true to indicate successful login
                        callback(true);
                    } else {
                        // execute callback with false to indicate failed login
                        callback(false);
                    }
                }, function (response) {
                    callback(false);
                });
    };
    service.Register = function (firstName, lastName, username, password, callback) {
        HttpService.post('/auth/authenticate', {firstName: firstName, lastName: lastName, username: username, password: password})
                .then(function (response) {
                    callback(true);
                }, function (response) {
                    callback(false);
                });
    };
    service.Logout = function () {
        $rootScope.currentUser = null;
        $http.defaults.headers.common.Authorization = '';
        $cookies.remove('article.user');
    };

    return service;
}]);