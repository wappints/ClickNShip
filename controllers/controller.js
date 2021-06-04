// import module from `../models/db.js`
const db = require('../models/db.js');
const Item = require('../models/ItemModel.js');
const User = require('../models/UserModel.js');

/*
    defines an object which contains functions executed as callback
    when a client requests for a certain path in the server
*/
const controller = {

    /*
        executed when the client sends an HTTP GET request `/ClickNShip.ico`
        as defined in `../routes/routes.js`
    */
    getFavicon: function (req, res) {
        res.status(204);
    },

    /*
        executed when the client sends an HTTP GET request `/home`
        as defined in `../routes/routes.js`
    */

    getIndex: function (req, res) {

       
        db.findMany(Item, {}, {}, function(result){
            var item = []
            console.log( result.length)

            for(var i = 0; i < result.length; i++){
                item[i] = {
                    itemName: result[i].itemName,
                    shopName: result[i].shopName, 
                    itemPrice: result[i].itemPrice,
                    _id: result[i]._id
                }
                console.log(item[i]._id);
            }
            
            //res.render('home', {item: item});
            res.render('Login' )
        });
    
    }
}
    
/*
    exports the object `controller` (defined above)
    when another script exports from this file
*/
module.exports = controller;
