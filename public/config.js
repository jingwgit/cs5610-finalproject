(function(){
    angular
        .module("WebDevFinalProject")
        .config(configuration);

	function configuration($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl : "views/home/home.view.client.html",
				controller: "HomeController",
				controllerAs: "model",
                resolve: {
                    currentUser: checkCurrentUser
                }
			})
            .when('/login', {
                templateUrl : "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when('/register', {
                templateUrl : "views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when('/admin', {
                templateUrl : "views/admin/admin.view.client.html",
                controller: "AdminController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkAdmin
                }
            })
            .when('/admin/user', {
                templateUrl : "views/admin/admin-user.view.client.html",
                controller: "AdminUserController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkAdmin
                }
            })
            .when('/admin/review', {
                templateUrl : "views/admin/admin-review.view.client.html",
                controller: "AdminReviewController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkAdmin
                }
            })
            .when('/profile', {
                templateUrl : "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
                //whatever the promise returned by checkLoggedIn will be
                // bound to the variable currentUser. This variable becomes
                // injectable object and can be added as dependency in any controller.
            })
            .when('/profile/edit', {
                templateUrl : "views/user/profile-edit.view.client.html",
                controller: "EditProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when('/user/:username/following', {
                templateUrl : "views/user/following-list.view.client.html",
                controller: "FollowingListController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when('/user/:username/follower', {
                templateUrl : "views/user/follower-list.view.client.html",
                controller: "FollowerListController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when('/review/search', {
                templateUrl : "views/review/review-search.view.client.html",
                controller: "ReviewSearchController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when('/movie/:imdbID/review/new', {
                templateUrl : "views/review/review-new.view.client.html",
                controller: "NewReviewController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when('/review/:reviewId', {
                templateUrl : "views/review/review-edit.view.client.html",
                controller: "EditReviewController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when('/movie/:imdbID/review', {
                templateUrl : "views/review/review-movie.view.client.html",
                controller: "ReviewListForMovieController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when('/user/:username/review', {
                templateUrl : "views/review/review-user.view.client.html",
                controller: "ReviewListForUserController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .otherwise({
                redirectTo : "/"
            });
    }

    function checkLoggedIn(UserService, $q, $location) {
        var deferred = $q.defer();
        UserService
            .checkLoggedIn()
            .then(function (user) {
                if(user === '0') {
                    deferred.reject();
                    $location.url('/');
                } else {
                    deferred.resolve(user);
                }
            });

        return deferred.promise;
    }

    function checkAdmin(UserService, $q, $location) {
        var deferred = $q.defer();
        UserService
            .checkAdmin()
            .then(function (user) {
                if(user === '0') {
                    deferred.reject();
                    $location.url('/');
                } else {
                    deferred.resolve(user);
                }
            });

        return deferred.promise;
    }

    function checkCurrentUser(UserService, $q, $location) {
        var deferred = $q.defer();
        UserService
            .checkLoggedIn()
            .then(function (user) {
                if(user === '0') {
                    deferred.resolve({}); //provide an empty object
                    //$location.url('/login');
                } else {
                    deferred.resolve(user);
                }
            });

        return deferred.promise;
    }



})();
