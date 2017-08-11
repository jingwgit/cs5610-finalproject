module.exports = function(app) {

    var connectionString =  null;

    if (process.env.MONGODB_URI) {
        connectionString = 'mongodb://jing:123456@ds159507.mlab.com:59507/heroku_16z70mm9';
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


