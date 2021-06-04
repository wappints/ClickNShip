var mongoose = require('mongoose');

var ShopSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },  

    shopName: {
        type: String,
        required: true
    },

    description: {
        type : String,
        required: false
    },

    shopPic : {
        type : String,
        required : false
    },

    public_id : {
        type : String, 
        required: false
    },

    itemID : [  {
        type : mongoose.Schema.Types.ObjectId,
    }],
    
});

module.exports = mongoose.model('shops', ShopSchema);