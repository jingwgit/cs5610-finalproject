module.exports = function(app) {

    var reviewModel = require("../model/review/review.model.server");

    app.post("/api/review", createReview);
    app.get("/api/review", isAdmin, findAllReviews);
    app.get("/api/user/:userId/review", findAllReviewsForUser);
    app.get("/api/movie/:imdbID/review", findAllReviewsForMovie);
    app.get("/api/review/:reviewId", findReviewById);
    app.put("/api/review/:reviewId", updateReview);
    app.delete("/api/review/:reviewId", isAdmin, deleteReview);
    app.delete("/api/user/:userId/review", deleteReviewsByUser);
    app.delete("/api/user/:userId/review/:reviewId", deleteReviewFromUser);



    function createReview(req, res) {
        var userId = req.user._id;
        var review = req.body;
        reviewModel
            .createReview(userId, review)
            .then(function (review) {
               res.send(review);
            });
    }

    function findAllReviews(req, res) {
        reviewModel
            .findAllReviews()
            .then(function (reviews) {
                res.send(reviews);
            });
    }

    function findAllReviewsForUser(req, res) {
        var userId = req.params.userId;
        reviewModel
            .findAllReviewsForUser(userId)
            .then(function (reviews) {
                res.send(reviews);
            });
    }

    function findAllReviewsForMovie(req, res) {
        var imdbID = req.params.imdbID;
        reviewModel
            .findAllReviewsForMovie(imdbID)
            .then(function (reviews) {
               res.send(reviews);
            });
    }

    function findReviewById(req, res) {
        var reviewId = req.params.reviewId;
        reviewModel
            .findReviewById(reviewId)
            .then(function (review) {
               res.send(review);
            });
    }

    function updateReview(req, res) {
        var reviewId = req.params.reviewId;
        var review = req.body;

        reviewModel
            .updateReview(reviewId, review)
            .then(function (status) {
                res.send(status);
            });
    }

    function deleteReview(req, res) {
        var reviewId = req.params.reviewId;
        reviewModel
            .deleteReview(reviewId)
            .then(function (status) {
               res.send(status);
            });
    }

    function deleteReviewFromUser(req, res) {
        var reviewId = req.params.reviewId;
        var userId = req.params.userId;
        reviewModel
            .deleteReviewFromUser(userId, reviewId)
            .then(function (status) {
                res.send(status);
            });
    }

    function deleteReviewsByUser(req, res) {
        var userId = req.params.userId;
        reviewModel
            .deleteReviewsByUser(userId)
            .then(function (status) {
               res.send(status);
            });
    }

    function isAdmin(req, res, next) {
        if(req.isAuthenticated() && req.user.roles.indexOf('ADMIN')> -1) {
            next();
        } else {
            res.sendStatus(401);
        }
    }

};


