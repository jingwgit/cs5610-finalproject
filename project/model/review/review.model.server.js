var mongoose = require("mongoose");
var reviewSchema = require("./review.schema.server");
var reviewModel = mongoose.model("ReviewModel", reviewSchema);
var userModel = require("../user/user.model.server");

module.exports = reviewModel;

reviewModel.createReview = createReview;
reviewModel.findAllReviews = findAllReviews;
reviewModel.findAllReviewsForUser = findAllReviewsForUser;
reviewModel.findAllReviewsForMovie = findAllReviewsForMovie;
reviewModel.findReviewById = findReviewById;
reviewModel.updateReview = updateReview;
reviewModel.deleteReview = deleteReview;
reviewModel.deleteReviewFromUser = deleteReviewFromUser;
reviewModel.deleteReviewsByUser = deleteReviewsByUser;

function createReview(userId, review) {
    review._user = userId;
    return reviewModel
        .create(review)
        .then(function (review) {
             userModel.addReview(userId, review._id);
        });
}

function findAllReviews() {
    return reviewModel
        .find()
        .populate('_user')
        .exec();
}

function findAllReviewsForUser(userId) {
    return reviewModel
        .find({_user: userId})
        .populate('_user')
        .exec();
}

function findAllReviewsForMovie(imdbID) {
    return reviewModel
        .find({imdbID: imdbID})
        .populate('_user')
        .exec();
}

function findReviewById(reviewId) {
    return reviewModel
        .findById(reviewId);
}

function updateReview(reviewId, review) {
    delete  review._user;
    return reviewModel.update({_id: reviewId}, {$set: review});
}

function deleteReview(reviewId) {
    return reviewModel
        .remove({_id: reviewId});
}

function deleteReviewFromUser(userId, reviewId) {
    return reviewModel
        .remove({_id: reviewId})
        .then(function (status) {
            return userModel
                .deleteReview(userId, reviewId);
        });
}

function deleteReviewsByUser(userId) {
    return reviewModel
        .remove({_user: userId});
}