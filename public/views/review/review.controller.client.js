(function() {
    angular
        .module("WebDevFinalProject")
        .controller("ReviewSearchController", ReviewSearchController)
        .controller("ReviewListForMovieController", ReviewListForMovieController)
        .controller("ReviewListForUserController", ReviewListForUserController)
        .controller("NewReviewController", NewReviewController)
        .controller("EditReviewController", EditReviewController);

    function ReviewSearchController(currentUser, $http) {
        var vm = this;
        vm.user = currentUser;
        vm.searchMovie = searchMovie;
        vm.selectMovie = selectMovie;

        function selectMovie(imdbID) {
            var url = "http://www.omdbapi.com/?apikey=852159f0&i=" + imdbID;
            $http.get(url)
                .then(function (response) {
                    vm.movie = response.data;
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                });
        }

        function searchMovie(title) {
            var url = "http://www.omdbapi.com/?apikey=852159f0&s=" + title;
            $http.get(url)
                .then(function (response) {
                    vm.movies = response.data.Search;
                });
        }
    }


    function ReviewListForMovieController(currentUser, $routeParams, ReviewService, $http, $location) {
        var vm = this;
        vm.user = currentUser;
        vm.imdbID = $routeParams.imdbID;
        vm.renderMovie = renderMovie;
        vm.navigateByUser = navigateByUser;

        init();

        function init() {
            findAllReviewsForMovie(vm.imdbID);
            renderMovie(vm.imdbID);
        }

        function navigateByUser(username) {
            if(username == vm.user.username) {
                $location.url('/profile');
            } else {
                $location.url('/user/' + username + '/review');
            }
        }

        function renderMovie(imdbID) {
            var url = "http://www.omdbapi.com/?apikey=852159f0&i=" + imdbID;
            $http.get(url)
                .then(function (response) {
                    vm.movie = response.data;
                    //$('html, body').animate({ scrollTop: 0 }, 'fast');
                });
        }

        function findAllReviewsForMovie(imdbID) {
            ReviewService
                .findAllReviewsForMovie(imdbID)
                .then(function (reviews) {
                   vm.reviews = reviews;
                });
        }
    }


    function ReviewListForUserController(currentUser, $http, ReviewService, $routeParams, UserService) {
        var vm = this;
        vm.currentUser = currentUser;
        vm.currentUserId = currentUser._id;
        vm.username = $routeParams.username;
        vm.followUser = followUser;
        vm.unfollowUser = unfollowUser;

        init();

        function init() {
            UserService
                .findUserByUsername(vm.username)
                .then(function (user) {
                    vm.user = user;
                    count(user);
                    ReviewService
                        .findAllReviewsForUser(user._id)
                        .then(function (reviews) {
                            vm.reviews = reviews;
                        });
                });
        }



        function count(user) {
            vm.followingNum = user.following.length;
            vm.postNum = user.reviews.length;
            vm.followerNum = user.followers.length;
        }


        function renderMovie(imdbID) {
            var url = "http://www.omdbapi.com/?apikey=852159f0&i=" + imdbID;
            $http.get(url)
                .then(function (response) {
                    vm.movie = response.data;
                });
        }

        function followUser() {
            UserService
                .followUser(vm.currentUser._id, vm.user._id)
                .then(function () {
                    UserService
                        .findUserByUsername(vm.username)
                        .then(function (user) {
                           count(user);
                           UserService
                               .findUserById(vm.currentUser._id)
                               .then(function (currentUser) {
                                   vm.currentUser = currentUser;
                               });
                        });
                });
        }

        function unfollowUser() {
            UserService
                .unfollowUser(vm.currentUser._id, vm.user._id)
                .then(function () {
                    UserService
                        .findUserByUsername(vm.username)
                        .then(function (user) {
                            count(user);
                            UserService
                                .findUserById(vm.currentUser._id)
                                .then(function (currentUser) {
                                    vm.currentUser = currentUser;
                                });
                        });
                });
        }

    }

    function NewReviewController(currentUser, $routeParams, $http, $timeout, ReviewService, $location){
        var vm = this;
        vm.user = currentUser;
        vm.userId = currentUser._id;
        vm.imdbID = $routeParams.imdbID;
        vm.renderMovie = renderMovie;
        vm.createReview = createReview;

        init();

        function init() {
            renderMovie(vm.imdbID);
        }

        function renderMovie(imdbID) {
            var url = "http://www.omdbapi.com/?apikey=852159f0&i=" + imdbID;
            $http.get(url)
                .then(function (response) {
                    vm.movie = response.data;
                    // $('html, body').animate({ scrollTop: 0 }, 'fast');
                });
        }

        function createReview() {
            if(!vm.text){
                vm.error = "Please write your review!";
                $timeout(function(){
                    vm.error = null;
                }, 3500);
                return;
            }
            var newReview = {
                movieTitle: vm.movie.Title,
                moviePoster: vm.movie.Poster,
                imdbID: vm.movie.imdbID,
                text: vm.text
            };

            ReviewService
                .createReview(newReview)
                .then(function () {
                    $location.url("/profile");
                }, function () {
                    vm.error = "Unable to create page!";
                    $timeout(function(){
                        vm.error = null;
                    }, 3500);
                });

        }
    }
    
    function EditReviewController(currentUser, $routeParams, $location, $http, $timeout, ReviewService){
        var vm = this;
        vm.user = currentUser;
        vm.userId = currentUser._id;
        vm.reviewId = $routeParams.reviewId;
        vm.editReview = editReview;
        vm.deleteReview = deleteReview;


        init();

        function init() {
            ReviewService.findReviewById(vm.reviewId)
                .then(function (cur) {
                    vm.currentReview = cur;
                    renderMovie(cur.imdbID);
                });
        }

        function renderMovie(imdbID) {
            var url = "http://www.omdbapi.com/?apikey=852159f0&i=" + imdbID;
            $http.get(url)
                .then(function (response) {
                    vm.movie = response.data;
                    //vm.imdbID = vm.movie.imdbID;
                });
        }


        function editReview() {
            if(!vm.currentReview.text){
                vm.error = "Review name cannot be empty";
                $timeout(function(){
                    vm.error = null;
                }, 3500);
                return;
            }

            var editedReview = {
                text: vm.currentReview.text
            };

            ReviewService
                .updateReview(vm.reviewId, editedReview)
                .then(function () {
                    $location.url("/profile");
                });

        }

        function deleteReview() {
            ReviewService
                .deleteReviewFromUser(vm.userId, vm.reviewId)
                .then(function () {
                    $location.url("/profile");
                }, function () {
                    vm.error = "Unable to delete review!";
                    $timeout(function(){
                        vm.error = null;
                    }, 3500);
                })

        }

    }
})();