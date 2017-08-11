module.exports = function(app) {

    var connectionString =  null;

    if (process.env.MONGODB_URI) {
        connectionString = 'mongodb://web_dev_fp:123456@ds137207.mlab.com:37207/heroku_3djfhqrh';
    }
        else
    {
        connectionString = 'mongodb://localhost/web_dev_fp'
    }

    var mongoose = require('mongoose');
    mongoose.connect(connectionString);

    //
    // var mongoose = require("mongoose");
    // mongoose.connect('mongodb://localhost/web_dev');
    // Use q. Note that you **must** use `require('q').Promise`.
    mongoose.Promise = require('q').Promise;

    require("./services/user.service.server.js")(app);
    require("./services/review.service.server.js")(app);
};


