var myapp = angular.module('app');
myapp.controller('LoginCtrl', ['$location', 'AuthService', function ($location, AuthService) {
        var vm = this;

        vm.login = function () {
            AuthService.Login(vm.username, vm.password, function (result) {
                if (result === true) {
                    $location.path('/');
                } else {
                    vm.error = 'Username or password is incorrect';
                }
            });
        };
        vm.register = function () {
            vm.loading = true;
            AuthService.Register(vm.firstName, vm.lastName, vm.username, vm.password, function (result) {
                if (result === true) {
                    vm.error = 'User Registration Successfully done';
                } else {
                    vm.error = 'Username already exists';
                    vm.loading = false;
                }
            });
        };

        init();

        function init() {
            // reset login status
            AuthService.Logout();
        }



    }]);
myapp.controller('ArticlesCtrl', ['$scope','$filter', 'HttpService', 'filterFilter', function ($scope,$filter, HttpService, filterFilter) {
        var vm = this;
        vm.currentPage = 0;
        vm.entryLimit = 5; //max rows for data table
        var masterData=[];
        vm.articles = [];
        vm.filter={};
        vm.filter.authors = [];
        vm.filter.selectedAutors = [];
        vm.filter.categories = [];
        vm.filter.selectedCategories = [];

        $scope.$watch('search', function (term) {
            vm.filtered = filterFilter(vm.articles, term);
        });
        
        $scope.$watchGroup([ 'vm.filter.selectedCategories+vm.filter.selectedAutors' ], function() {
		var authors = $filter('filter')(
				masterData,
				function(actual) {
					if (vm.filter.selectedAutors.indexOf(actual.author.name) === -1 
                                                || vm.filter.selectedCategories.indexOf(actual.category) === -1) {
						return false;
					}
					return true;
				});
		
		vm.filtered = authors;
	}, true);

        vm.init = function () {
            HttpService.get('/data/articles')
                    .then(function (response) {
                        var articles = [];
                        var authors = [],categories=[];
                        angular.forEach(response, function (value, key) {
                            value['id'] = key;
                            articles.push(value);
                            if (authors.indexOf(value.author.name) === -1) {
                                authors.push(value.author.name);
                            }
                            if (categories.indexOf(value.category) === -1) {
                                categories.push(value.category);
                            }
                        });
                        vm.articles = articles;
                        angular.copy(articles,masterData);
                        vm.filter.authors = authors;
                        vm.filter.categories = categories;
                        angular.copy(vm.filter.authors, vm.filter.selectedAutors);
                        angular.copy(vm.filter.categories, vm.filter.selectedCategories);
                        angular.copy(vm.articles, vm.filtered);
                    }, function (response) {
                        console.log('error' + response);
                    });
        };
    }]);
myapp.controller('EditArticleCtrl', ['articleId', 'HttpService', '$rootScope', 'Lightbox', function (articleId, HttpService, $rootScope, Lightbox) {
        var vm = this;
        vm.isNew = (isNaN(articleId) ? true : false);
        vm.mode = false;
        var originalData = {};

        vm.reset = function () {
            angular.copy(originalData, vm.data);
        };
        vm.save = function () {
            if (vm.isNew) {
                HttpService.post('/data/article/new', vm.data)
                        .then(function (response) {
                            vm.data = response;
                            articleId = response['articleId'];
                            angular.copy(vm.data, originalData);
                            vm.isNew = false;
                        }, function (response) {
                            console.log('error' + response);
                        });
            } else {

                HttpService.put('/data/article/' + articleId, vm.data)
                        .then(function (response) {
                            angular.copy(vm.data, originalData);
                        }, function (response) {
                            console.log('error' + response);
                        });


            }
            vm.mode = !vm.mode;
        };
        vm.saveComment = function () {
            HttpService.post('/data/comments/' + articleId, vm.comment)
                    .then(function (response) {
                        vm.data.comments.push({data: vm.comment.data, author: $rootScope.currentUser.name, date: Date.now()});
                        vm.comment = '';
                        alert('Comment added Succesfully');
                    }, function (response) {
                        console.log('error' + response);
                    });
        };
        vm.delete = function () {
            HttpService.get('/data/article/' + articleId)
                    .then(function (response) {
                        vm.data = response;
                        angular.copy(vm.data, vm.originalData);
                        vm.mode = false;
                    }, function (response) {
                        console.log('error' + response);
                    });

        };
        vm.openLightboxModal = function (image) {
            Lightbox.openModal([{url: image, thumbUrl: image}], 0);
        };
        init();

        function init() {
            if (vm.isNew) {
                vm.mode = true;
            } else {
                HttpService.get('/data/article/' + articleId)
                        .then(function (response) {
                            vm.data = response;
                            angular.copy(vm.data, originalData);
                        }, function (response) {
                            console.log('error' + response);
                        });
            }

        }
    }]);
myapp.controller('UploadImageModalInstance', ['Upload', '$uibModalInstance', function (Upload, $uibModalInstance) {
        var vm = this;
        vm.submit = function () {
            Upload.upload({
                url: 'data/upload',
                data: {file: vm.file}
            }).then(function (resp) {
                if (resp.data.filename) { //validate success
                    $uibModalInstance.close(resp.data.filename);
                } else {
                    alert('an error occured');
                }
            }, function (resp) { //catch error
                alert('Error status: ' + resp.status);
            });
        };
    }]);