(function() {
    angular
        .module("WebDevFinalProject")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
        .controller("EditProfileController", EditProfileController)
        .controller("FollowingListController", FollowingListController)
        .controller("FollowerListController", FollowerListController);

    function LoginController($location, UserService, $timeout) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            if (!username) {
                vm.error = "Please enter your username";
                return;
            }
            if (!password) {
                vm.error = "Please enter your password";
                return;
            }

            UserService
                .login(username, password)
                .then(function (user) {
                    $location.url("/profile");
                }, function (error) {
                    vm.error = "Username and password don't match!";
                    $timeout(function() {
                        vm.error = null;
                    }, 5000);
                });
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register() {
            if (!vm.username || !vm.password) {
                vm.error = "Username and passwords cannot be empty.";
                return;
            }
            if (vm.password !== vm.vpassword) {
                vm.error = "Passwords don't match.";
                return;
            }

            UserService
                .findUserByUsername(vm.username)
                .then(function (user) {
                    vm.error = "Username already exists";
                }, function (error) {
                    var newUser = {
                        username: vm.username,
                        password: vm.password,
                        firstName: vm.firstName,
                        lastName: vm.lastName
                    };

                    return UserService
                        .register(newUser)
                        .then(function () {
                            $location.url("/profile");
                        });
                });
        }
    }

    function ProfileController(currentUser, $location, $timeout, UserService, ReviewService) {
        var vm = this;
        vm.user = currentUser;
        var userId = currentUser._id;
        vm.deleteReview = deleteReview;
        vm.logout = logout;
        vm.count = count;


        init();

        function init() {
            count(vm.user);
            findAllReviewsForUser();
        }

        function deleteReview(userId, reviewId) {
            ReviewService
                .deleteReviewFromUser(userId, reviewId)
                .then(function () {
                    findAllReviewsForUser();
                    UserService.findUserByUsername(vm.user.username)
                        .then(function (user) {
                           count(user);
                        });
                    vm.message = " Successfully deleted review!";
                    $timeout(function(){
                        vm.message = null;
                    }, 3000);

                }, function () {
                    vm.error = "Unable to delete review!";
                    $timeout(function(){
                        vm.error = null;
                    }, 3000);
                })

        }

        function findAllReviewsForUser() {
            ReviewService
                .findAllReviewsForUser(vm.user._id)
                .then(function (reviews) {
                    vm.reviews = reviews;
                })
        }


        function count(user) {
            vm.followingNum = user.following.length;
            vm.postNum = user.reviews.length;
            vm.followerNum = user.followers.length;
        }


        function logout() {
            UserService
                .logout()
                .then(function () {
                   $location.url('/');
                });
        }


    }

    function EditProfileController(currentUser, $location, $timeout, UserService) {
        var vm = this;
        vm.user = currentUser;
        var userId = currentUser._id;
        vm.changeProfile = changeProfile;
        vm.logout = logout;
        vm.unregister = unregister;


        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/');
                });
        }

        function unregister() {
            UserService
                .unregister()
                .then(function () {
                    $location.url('/');
                }, function () {
                    vm.error = "Unable to delete user!"
                });
        }

        function changeProfile(user) {
            UserService
                .changeProfile(user._id, user)
                .then(function () {
                    $location.url("/profile");
                    vm.message = "Profile changes saved! "
                });

            $timeout(function () {
                vm.message = null;
            }, 3000);
        }
    }


    function FollowingListController($routeParams, UserService) {
        var vm = this;
        vm.username = $routeParams.username;

        init();

        function init() {
            UserService
                .findUserByUsername(vm.username)
                .then(function (user) {
                    vm.user = user;
                });
        }


    }

    function FollowerListController($routeParams, UserService) {
        var vm = this;
        vm.username = $routeParams.username;

        init();

        function init() {
            UserService
                .findUserByUsername(vm.username)
                .then(function (user) {
                    vm.user = user;
                });
        }


    }
})();
