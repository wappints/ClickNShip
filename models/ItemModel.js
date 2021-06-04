
var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    }, 
    shopName: {
        type: String,
        required: true
    }, 

    upvote: {
        type: Number,
        required: true
    }, 
    downvote: {
        type: Number,
        required: true
    }, 
    stocks: {
        type: Number,
        required: true
    }, 
    itemPrice: {
        type: Number,
        required: true
    }, 
    description: {
        type: String,
        required: true
    }, 
    sold: {
        type: Number,
        required: true
    }, 
    category: {
        type: String,
        required: true
    }, 

    itemPic:{
        type: String, 
    }, 
    public_id:{
        type: String
    },
    comments: {
        type: Array
    }
});

module.exports = mongoose.model('Item', ItemSchema, 'item');