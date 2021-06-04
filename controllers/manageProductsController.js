
// import module `database` from `../models/db.js`
const db = require('../models/db.js');
const mongoose = require('mongoose');
const Shop = require('../models/ShopModel.js');
const Item = require('../models/ItemModel.js');
const User= require('../models/UserModel.js');

const manageProductsController = {

    getProducts : function (req, res) {

        if (req.session.username)
        {
            var trays = [];
            var y = req.body.shopName;
            console.log(y)
            var x = req.session.username;
            db.findOne(User, {username : x}, {}, function (result) 
            { 
                if (result.shopName == req.params.shopName)
                {
                    db.findOne(Shop, {username : x}, {}, function (result) 
                    {
                        console.log("FIND ONE SHOP ")
                        //console.log(result)
                        var array = {itemID : []}
                        var shop = result.shopName
                        var z = 0; 
                        if (result != null) 
                        {
                            //console.log("SUCCESS")
                            for(z = 0; z < result.itemID.length; z++) {
                                array.itemID[z] =  result.itemID[z];
                                //console.log("HI")
                                //console.log(array.itemID[z])
                            }
                            
                            db.findMany(Item, {_id : { $in : array.itemID }}, {}, function (result) {   
                                //console.log(result)
                                console.log("HIS")
                                var obj = {}
                                //console.log(shop)
                                for (var i = 0; i < array.itemID.length; i++){   
                                    
                                    for (var j of result){
                                      
                                        if (array.itemID[i].equals(j._id)) {

                                            obj = {}
                                            obj["itemID"] = j._id;
                                            obj["shopName"] = shop
                                            obj["itemName"] = j.itemName;
                                            obj["category"] = j.category;
                                            obj["stocks"] = j.stocks;
                                            obj["itemPrice"]  = j.itemPrice;
                                            //console.log("DETAILS")
                                            //console.log(obj.itemID)
                                            //console.log(obj.itemName)

                                            trays.push(obj);

                                            console.log(trays[i])
                                        }
                                    }
                               
                                }
                                console.log("OBJECT")
                                console.log(trays)
                                res.render('manageProducts', {item: trays, usernameLink : "/profile/" + req.session.username, shopName : req.params.shopName});
                            });
                            
                        }
                    });
                }
            });
        }
        else{
            res.redirect('/login');
        }
    },

    removeProduct : function (req, res) {

        var id = req.query._id;
        var Name = req.query.shopName;
        Name = Name.trim();
        console.log(Name)
        console.log("ObjectID is " + id);
        id = id.trim();
        id = new mongoose.mongo.ObjectId(id)
        db.deleteOne(Item, { _id :  id  }, function(result)
        {
            console.log(result)
            console.log("SHOPNAME IS" + Name)
            
        });
        db.findOne(Shop, {shopName : Name}, {}, function (result)
        {
            console.log(Name)
            console.log(result.shopName)
            console.log("TESTSHOP")
            
            console.log(result)
            array = []
            for (i = 0; i < result.itemID.length; i++)
            {
                if (!id.equals(result.itemID[i]))
                {
                    console.log(id + " === " + result.itemID[i])
                    array.push(result.itemID[i]);
                    console.log("PUSH")
                }
                    
            }
            console.log(array)
            db.updateOne(Shop, {shopName : Name}, {itemID : array}, function (result)
            {
                res.send(result);
            })

        })

    }



}

module.exports = manageProductsController;
