
// import module `mongodb`
var mongoose = require('mongoose');

// defines the schema for collection `users`
var cartSchema = new mongoose.Schema({
   
    itemID : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },

    qty: {
        type: Number,
        required: true
    }

});

/*
    exports a mongodb.model object based on cartSchema` (defined above)
    when another script exports from this file
    This model executes CRUD operations
    to collection `users` -> plural of the argument `User`
*/
module.exports = mongoose.model('Cart', cartSchema, 'cart');

               // To change user ^ ? ? ? ? ? ?
