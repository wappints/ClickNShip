// import module `mongoose`
const { ObjectID } = require('bson');
var mongoose = require('mongoose');

// defines the schema for collection `users`
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    fname: {
        type: String,
        required: true
    },

    lname: {
        type: String,
        required: true
    },

    contactno: {
        type: Number,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    shopName: {
        type : String,
        required: false
    },
    
    userPic : {
        type : String,
        required : false
    },

    public_id : {
        type : String, 
        required: false
    }, 
    upvote: [{type: ObjectID}], 
    downvote: [{type: ObjectID}]
});

/*
    exports a mongoose.model object based on `UserSchema` (defined above)
    when another script exports from this file
    This model executes CRUD operations
    to collection `users` -> plural of the argument `User`
*/
module.exports = mongoose.model('User', UserSchema);