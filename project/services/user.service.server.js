module.exports = function(app) {
    var userModel = require("../model/user/user.model.server");
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var bcrypt = require("bcrypt-nodejs");

    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);


    //passport facebook strategy
    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL  : process.env.FACEBOOK_CALLBACK_URL
    };
    var FacebookStrategy = require('passport-facebook').Strategy;
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    app.get ('/auth/facebook',
        passport.authenticate('facebook', { scope : 'email'}));


    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/#!/profile',
            failureRedirect: '/#!/login'
        }));


    //passport google strategy
    var googleConfig = {
        clientID : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : process.env.GOOGLE_CALLBACK_URL
    };

    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    app.get('/auth/google',
        passport.authenticate('google',
            { scope : ['profile', 'email']}));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/#!/profile',
            failureRedirect: '/#!/login'
        }));


    app.post("/api/user", isAdmin, createUser);
    app.get("/api/user", isAdmin, findAllUsers);
    app.get("/api/user/username", findUserByUsername);
    app.get("/api/user/credentials", findUserByCredentials);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", isAdmin, updateUser);
    app.put("/api/profile/:userId", changeProfile);
    app.delete("/api/user/:userId", isAdmin, deleteUser);

    app.post("/api/login", passport.authenticate('local'), login);
    app.post("/api/logout", logout);
    app.post("/api/register", register);
    app.put("/api/follow/follower/:followerId/following/:followingId", followUser);
    app.put("/api/unfollow/follower/:followerId/following/:followingId", unfollowUser);

    // app.post ("/api/upload", upload.single('myFile'), uploadImage);

    app.post("/api/unregister", unregister);
    app.get("/api/checkLoggedIn", checkLoggedIn);
    app.get("/api/checkAdmin", checkAdmin);


    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(function(user) {
                if(user && bcrypt.compareSync(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function isAdmin(req, res, next) {
        if(req.isAuthenticated() && req.user.roles.indexOf('ADMIN')> -1) {
            next();
        } else {
            res.sendStatus(401);
        }
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user)
            .then(function (user) {
                req.login(user, function (status) {
                   res.send(status);
                });
            });
    }

    function followUser(req, res) {
        var followerId = req.params.followerId;
        var followingId = req.params.followingId;
        userModel
            .followUser(followerId, followingId)
            .then(function (status) {
               res.send(status);
            });
    }

    function unfollowUser(req, res) {
        var followerId = req.params.followerId;
        var followingId = req.params.followingId;
        userModel
            .unfollowUser(followerId, followingId)
            .then(function (status) {
               res.send(status);
            });

    }

    function unregister(req, res) {
        userModel
            .deleteUser(req.user._id)
            .then(function (user) {
                req.logout();
                res.sendStatus(200);
            });
    }

    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    function checkLoggedIn(req, res) {
        if(req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }

    function checkAdmin(req, res) {
        if(req.isAuthenticated() && req.user.roles.indexOf('ADMIN') > -1) {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    //to decide what to put in the cookie
    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }


    function createUser(req, res){
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user)
            .then(function (user) {
               res.json(user);
            }, function (error) {
                res.send(error);
            });
    }

    function findAllUsers(req, res) {
        userModel
            .findAllUsers()
            .then(function (users) {
               res.send(users);
            });
    }

    function findUserByUsername(req, res) {

        var username = req.query.username;
        userModel
            .findUserByUsername(username)
            .then(function (user) {
                if(user) {
                    res.json(user);
                    return;
                } else {
                    res.sendStatus(404);
                }
            });
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        userModel
            .findUserByCredentials(username, password)
            .then(function (user) {
               if(user) {
                   res.json(user);
               }  else {
                   res.sendStatus(404);
               }
            });
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        userModel
            .findUserById(userId)
            .then(function (user) {
               res.json(user);
            });
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        userModel
            .updateUser(userId, newUser)
            .then(function (status) {
                res.send(status);
            });
    }

    function changeProfile(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        userModel
            .updateUser(userId, newUser)
            .then(function (status) {
                res.send(status);
            });
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        userModel
            .deleteUser(userId)
            .then(function (status) {
               res.send(status);
            });
    }

    function googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return userModel.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }


    function facebookStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByFacebookId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var firstName = profile.displayName.split(' ')[0];
                        var lastName = profile.displayName.split(' ')[1];
                        var newFacebookUser = {
                            username:  firstName.toLowerCase() + lastName.toLowerCase(),
                            firstName: firstName,
                            lastName:  lastName,
                            facebook: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return userModel.createUser(newFacebookUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

};


