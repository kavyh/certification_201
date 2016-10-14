var myapp = angular.module('app', ['ngMessages', 'ngCookies', 'ui.router', 'textAngular', 'ui.bootstrap', 'bootstrapLightbox','ngFileUpload','appDirectives']);
myapp.run(['$rootScope', '$http', '$location', '$cookies',function ($rootScope, $http, $location, $cookies) {
    // keep user logged in after page refresh
    var usr = $cookies.getObject('article.user');
    if (usr) {
        $rootScope.currentUser = usr;
        $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.currentUser.token;
    }

    // redirect to login page if not logged in and trying to access a restricted page
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var publicPages = ['/login', '/register'];
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if (restrictedPage && !$rootScope.currentUser) {
            $location.path('/login');
        }
    });
}]);
myapp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    // default route
    $urlRouterProvider.otherwise("/");

    // app routes
    $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'templates/home.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'vm'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'templates/register.html',
                controller: 'LoginCtrl',
                controllerAs: 'vm'
            })
            .state('articles', {
                url: '/articles',
                templateUrl: 'templates/articles.html',
                controller: 'ArticlesCtrl',
                controllerAs: 'vm'
            })
            .state('viewArticle', {
                url: '/articles/{articleId}',
                templateUrl: 'templates/editArticle.html',
                controller: 'EditArticleCtrl',
                controllerAs: 'vm',
                resolve: {
                    articleId: ['$stateParams', function ($stateParams) {
                            return $stateParams.articleId;
                        }]
                }
            });
}]);
myapp.config(['$provide',function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', '$uibModal', function (taRegisterTool, taOptions, $uibModal) {
            taRegisterTool('uploadImage', {
                iconclass: "fa fa-image",
                action: function (deferred) {
                    var editor = this.$editor();
                    $uibModal.open({
                        templateUrl: 'templates/upload.html',
                        controller: 'UploadImageModalInstance',
                        controllerAs: 'vm'
                    }).result.then(
                            function (result) {
                                result = 'images/' + result;
                                var data = '<div><img src=\'' + result + '\' width="388" height="159" class="light-box-directive"/></div>';
                                console.log(data);
                                editor.wrapSelection('insertHtml', data);
                                deferred.resolve();
                            },
                            function () {
                                deferred.resolve();
                            }
                    );
                    return false;
                }
            });
            taOptions.toolbar[1].push('uploadImage');
            //delete previous image icon
            taOptions.toolbar[3].splice(taOptions.toolbar[3].indexOf('insertImage'), 1);
            return taOptions;
        }]);
}]);
