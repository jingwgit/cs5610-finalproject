var mongoose = require("mongoose");
var userSchema = require("./user.schema.server");
var userModel = mongoose.model("UserModel", userSchema);

userModel.createUser = createUser;
userModel.findUserById = findUserById;
userModel.findAllUsers = findAllUsers;
userModel.findUserByUsername = findUserByUsername;
userModel.findUserByFacebookId = findUserByFacebookId;
userModel.findUserByGoogleId = findUserByGoogleId;
userModel.findUserByCredentials = findUserByCredentials;
userModel.updateUser = updateUser;
userModel.addToFollowing = addToFollowing;
userModel.addToFollowers = addToFollowers;
userModel.removeFromFollowing = removeFromFollowing;
userModel.removeFromFollowers = removeFromFollowers;
userModel.followUser = followUser;
userModel.unfollowUser = unfollowUser;
userModel.deleteUser = deleteUser;
userModel.addReview = addReview;
userModel.deleteReview = deleteReview;


module.exports = userModel;


function addReview(userId, reviewId) {
    return userModel
        .findById(userId)
        .then(function (user) {
            user.reviews.push(reviewId);
            return user.save();
        });
}

function createUser(user) {
    if(user.roles) {
        var roleArray = user.roles.split(",");
        user.roles = roleArray;
    } else {
        user.roles = ['USER'];
    }
    return userModel.create(user);
}

function findUserById(userId) {
    return userModel
        .findById(userId);
}

function findAllUsers() {
    return userModel.find();
}

function findUserByUsername(username) {
    return userModel
        .findOne({username: username})
        .populate("following followers")
        .exec();
}

function findUserByFacebookId(facebookId) {
    return userModel
        .findOne({'facebook.id': facebookId});
}

function findUserByGoogleId(googleId) {
    return userModel
        .findOne({'google.id': googleId});
}

function findUserByCredentials(username, password) {
    return userModel.findOne({username: username, password: password});
}

function updateUser(userId, newUser) {
    if(typeof newUser.roles === 'String') {
        newUser.roles = newUser.roles.split(',');
    }
    return userModel.update({_id: userId}, {$set: newUser});
}

function followUser(followerId, followingId) {
    return userModel
        .addToFollowing(followerId, followingId)
        .then(function () {
            return userModel
                .addToFollowers(followerId, followingId);
        });
}

function addToFollowing(followerId, followingId ) {
    return userModel
        .findById(followerId)
        .then(function (follower) {
            var index = follower.following.indexOf(followingId);
            if(index === -1) {
                follower.following.push(followingId);
            }
            return follower.save();
        });
}

function addToFollowers(followerId, followingId) {
    return userModel
        .findById(followingId)
        .then(function (following) {
            var index = following.followers.indexOf(followerId);
            if(index === -1) {
                following.followers.push(followerId);
            }
            return following.save();
        });
}

function unfollowUser(followerId, followingId) {
    return userModel
        .removeFromFollowing(followerId, followingId)
        .then(function () {
            return userModel
                .removeFromFollowers(followerId, followingId);
        });
}

function removeFromFollowing(followerId, followingId) {
    return userModel
        .findById(followerId)
        .then(function (follower) {
            var index = follower.following.indexOf(followingId);
            if(index > -1) {
                follower.following.splice(index, 1);
            }
            return follower.save();
        });
}

function removeFromFollowers(followerId, followingId) {
    return userModel
        .findById(followingId)
        .then(function (following) {
            var index = following.followers.indexOf(followerId);
            if(index > -1) {
                following.followers.splice(index, 1);
            }
            return following.save();
        });
}

function deleteUser(userId) {
    return userModel
        .remove({_id: userId});
}

function deleteReview(userId, reviewId) {
    return userModel
        .findById(userId)
        .then(function (user) {
            var index = user.reviews.indexOf(reviewId);
            user.reviews.splice(index, 1); //modify the movies in the ram
            return user.save(); // save to the database
        });
}

