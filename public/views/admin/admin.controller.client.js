(function() {
    angular
        .module("WebDevFinalProject")
        .controller("AdminController", AdminController)
        .controller("AdminUserController", AdminUserController)
        .controller("AdminReviewController", AdminReviewController);

    function AdminController(currentUser, UserService) {
        var vm = this;
        vm.currentUser = currentUser;
    }

    function AdminUserController(currentUser, UserService) {
        var vm = this;
        vm.currentUser = currentUser;
        vm.deleteUser = deleteUser;
        vm.createUser = createUser;
        vm.selectUser = selectUser;
        vm.updateUser = updateUser;

        init();
        
        function init() {
            findAllUsers();
        }

        function createUser(user) {
            UserService
                .createUser(user)
                .then(findAllUsers());
        }

        function selectUser(user) {
            vm.user = angular.copy(user);
        }

        function updateUser(user) {
            UserService
                .updateUser(user._id, user)
                .then(function () {
                    findAllUsers();
                    vm.user = null;
                });
        }


        function deleteUser(user) {
            UserService
                .deleteUser(user._id)
                .then(function () {
                    findAllUsers();
                    vm.user = null;
                });
        }

        function findAllUsers() {
            UserService
                .findAllUsers()
                .then(function (users) {
                    vm.users = users;
                });
        }
    }

    function AdminReviewController(currentUser, ReviewService) {
        var vm = this;
        vm.currentUser = currentUser;
        vm.deleteReview = deleteReview;

        init();

        function init() {
            findAllReviews();
        }


        function deleteReview(review) {
            ReviewService
                .deleteReviewFromUser(review._id)
                .then(findAllReviews());
        }

        function findAllReviews() {
            ReviewService
                .findAllReviews()
                .then(function (reviews) {
                    vm.reviews = reviews;
                });
        }
    }


})();
