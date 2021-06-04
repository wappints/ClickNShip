const mongoose = require('mongoose');
// import module `database` from `../models/db.js`
const db = require('../models/db.js');

const Shop = require('../models/ShopModel.js');

const Item = require('../models/ItemModel.js');
const { url } = require('../utils/cloudinary.js');
const { array } = require('../utils/multer.js');
/*
    defines an object which contains functions executed as callback
    when a client requests for `cart` paths in the server
*/
const   viewshopController = {

    /*
        executed when the client sends an HTTP GET request `/checkout`
        as defined in `../routes/routes.js`
    */
   
    getShop: function (req, res) {

        if (req.session.username){

            var shopName = req.params.shopname;
            console.log(shopName)
            db.findOne(Shop, {shopName : shopName}, {}, function (result){
                if(result != null){
                    var items = []
                    var details = {}

                    details.flag = false;
                    
                    if (req.session.username == result.username)
                        details.flag = true;

                    items = result.itemID;

                    details.shopPic = result.shopPic;
                    details.shopName = result.shopName;
                    details.shopDescription  = result.description;
                    details.username = result.username; 
                    details.usernameLink = "/profile/" + req.session.username;

                    console.log(details);
                    console.log("FFFF SHPP")
                    db.findMany(Item, {_id : {$in : items}} , {}, function (result)
                    {
                        console.log("THE ITEMS ARE")
                        console.log(result)
                        var url = ""
                        var array2 = []
                        var temp
                        for (var i of result)
                        {
                            url = "/viewitem/:" + i._id + "/" + i.itemName; // ung image ng product (hindi ung URL) kaya niya mapunta sa viewItem niya
                            temp = {
                                URL : url,
                                imgURL : i.itemPic,
                                Name : i.itemName
                            }
                            array2.push(temp);
                        }
                        console.log(array2)

                        details.items = array2;
                        console.log(details)
                    res.render('viewShop', details) // add attribute for user? 
                    });
                }
            });
        }
        else{
            res.redirect('/login');
        }
    }


}

module.exports = viewshopController;
