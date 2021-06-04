var mongoose = require('mongoose');
const { ObjectID } = require('bson');

var CommentSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },  


    itemID : {
        type : ObjectID,
        required : false
    },

    comment: {
        type: String,
        required: true
    },

    userPic:{
        type: String
    }
    
});

module.exports = mongoose.model('Comment', CommentSchema, 'comment');