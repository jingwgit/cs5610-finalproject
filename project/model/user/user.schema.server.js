var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String,
    roles: [{type: String,
        default: 'USER',
        enum: ['USER', 'ADMIN']}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: "UserModel"}],
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: "UserModel"}],
    email: String,
    phone: String,
    bio: String,
    avatar: {type: String, default: "http://www.jbhdq.com/uploadfile/2016/0316/thumb_255_0_20160316123009127.jpg"},
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: "ReviewModel"}],
    facebook: {
        id:    String,
        token: String
    },
    dateCreated: {type: Date, default: Date.now()}
}, {collection: "user"});


module.exports = userSchema;