(function () {
    angular
        .module("WebDevFinalProject")
        .factory('ReviewService', ReviewService);

    function ReviewService($http) {

            var api = {
                'createReview': createReview,
                "findAllReviews": findAllReviews,
                'findAllReviewsForUser': findAllReviewsForUser,
                'findAllReviewsForMovie': findAllReviewsForMovie,
                'findReviewById': findReviewById,
                'updateReview': updateReview,
                'deleteReview': deleteReview,
                'deleteReviewsByUser': deleteReviewsByUser,
                'deleteReviewFromUser': deleteReviewFromUser
            };
            return api;

        function createReview(review) {
            var url = "/api/review";
            return $http.post(url, review)
                .then(function (response) {
                    return response.data;
                });
        }


        function findAllReviews() {
            var url = "/api/review";
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllReviewsForUser(userId) {
            var url = "/api/user/" + userId + "/review";
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllReviewsForMovie(imdbId) {
            var url = "/api/movie/" + imdbId + "/review";
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findReviewById(reviewId) {
            var url = "/api/review/" + reviewId ;
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateReview(reviewId, review) {
            var url = "/api/review/"+ reviewId;
            return $http.put(url, review)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteReview(reviewId) {
            var url = "/api/review/" + reviewId;
            return $http.delete(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteReviewFromUser(userId, reviewId) {
            var url = "/api/user/" + userId + "/review/" + reviewId;
            return $http.delete(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteReviewsByUser(userId) {
            var url = "/api/user/" + userId + "/review";
            return $http.delete(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();