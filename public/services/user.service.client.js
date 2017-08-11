(function () {
    angular
        .module("WebDevFinalProject")
        .factory('UserService', UserService);

    function UserService($http) {

        var api = {
            "createUser": createUser,
            "findAllUsers": findAllUsers,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "changeProfile": changeProfile,
            "deleteUser": deleteUser,
            "login" : login,
            "checkLoggedIn": checkLoggedIn,
            "logout" : logout,
            "register": register,
            "unregister": unregister,
            "checkAdmin": checkAdmin,
            "followUser": followUser,
            "unfollowUser": unfollowUser
        };
        return api;

        function followUser(followerId, followingId) {
            var url = "/api/follow/follower/" + followerId + "/following/" + followingId;
            return $http.put(url)
                .then(function (response) {
                   return response.data;
                });
        }

        function unfollowUser(followerId, followingId) {
            var url = "/api/unfollow/follower/" + followerId + "/following/" + followingId;
            return $http.put(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function register(user) {
            var url = "/api/register";
            return $http.post(url, user)
                .then(function (response) {
                    return response.data;
                });
        }

        function unregister() {
            var url = "/api/unregister";
            return $http.post(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function checkLoggedIn() {
            var url = "/api/checkLoggedIn";
            return $http.get(url)
                .then(function (response) {
                   return response.data;
                });
        }

        function checkAdmin() {
            var url = "/api/checkAdmin";
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function logout() {
            var url = "/api/logout";
            return $http.post(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function login(username, password) {
            var url = "/api/login";
            var credentials = {
                username: username,
                password: password
            };
            return $http.post(url, credentials)
                .then(function (response) {
                    return response.data;
                });
        }

        function createUser(user) {
            var url = "/api/user";
            return $http.post(url, user)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllUsers() {
            var url = "/api/user";
            return $http.get(url)
                .then(function (response) {
                   return response.data;
                });
        }

        function findUserById(userId) {
            var url = "/api/user/" + userId;
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserByUsername(username) {
            var url = "/api/user/username?username=" + username;
            return $http.get(url)
                .then(function (response) {
                     return response.data;
                 });
        }

        function findUserByCredentials(username, password) {
            var url = "/api/user/credentials?"+"username="+username+"&"+"password="+password;
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateUser(userId, user) {
            var url = "/api/user/" + userId;
            return $http.put(url, user)
                .then(function (response) {
                    return response.data;
                });
        }

        function changeProfile(userId, user) {
            var url = "/api/profile/" + userId;
            return $http.put(url, user)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteUser(userId) {
            var url = "/api/user/" + userId;
            return $http.delete(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();