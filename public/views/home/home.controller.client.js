(function() {
    angular
        .module("WebDevFinalProject")
        .controller("HomeController", HomeController);

    function HomeController(currentUser, UserService, $window) {
        var vm = this;
        vm.currentUser = currentUser;
        vm.logout = logout;

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $window.location.reload();
                });
        }
    }

})();
