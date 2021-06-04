const { body } = require('express-validator');
const fs = require('fs');

const db = require('../models/db.js');

const Shop = require('../models/ShopModel.js');
const User = require('../models/UserModel.js');

const cloudinary = require('../utils/cloudinary'); 
const upload = require('../utils/multer'); 

const editShopController = {

    getShopEditor: function (req, res) {
        if (req.session.username){
            var temp = {
                username : req.session.username
            };
            var projection = 'username description shopName description shopPic';

            db.findOne(Shop, temp, projection, function(result){
                //if user has shop
                if (result != null){
                    var details = {
                        username : result.username,
                        shopName : result.shopName,
                        description : result.description,
                        shopPic : result.shopPic,
                        public_id: result.public_id
                    };
                    res.render('editShop', details)
                }
                else //if user does not have shop
                    res.render('editShop');
            });
        }
        else{
            res.redirect('/login');
        }
    },

    postShopEdit: async function (req, res) {

        var shopName = req.body.shopName;
        var description = req.body.description;
        var username = req.session.username; 
        var shopPic = req.body.shopPic
    
        if (typeof req.file !== 'undefined'){ //if image is not empty, upload
            try{
                var img = await cloudinary.uploader.upload(req.file.path);
                var shopPic =  img.url;
                var public_id = img.public_id; 
               
            } catch(err){
                console.log(err)
            }
        }
       

        var temp = {
            username : username
        };

        var shop = { //the changes
            username : username,
            shopName : shopName,
            description : description,
            shopPic : shopPic,
            public_id : public_id
        }

        db.findOne(Shop, temp, {}, function(result){
            //if user has shop
            if (result != null){

                if (typeof req.file == 'undefined'){
                     shop.shopPic = result.shopPic;
                     shop.public_id = result.public_id; 
                 }

                
                //model , things to change, the changes 
                db.updateOne(Shop, temp, shop, function(flag){

                    if(flag){
                        projection = "shopName";
                        db.findOne(User, temp, projection, function(result){
                            if (result != null){
                                user = {
                                    shopName : shop.shopName
                                }

                                db.updateOne(User, temp, user, function(flag){
                                });
                            }
                        });

                        var shopLink = "/shop/" + shop.shopName;
                        res.redirect(shopLink);
                    }
                });
               
            }
            else{ //if user does not have shop
                db.insertOne(Shop, shop, function(flag) {
                    if(flag) {
                        projection = "shopName";
                        db.findOne(User, temp, projection, function(result){
                            if (result != null){
                                user = {
                                    shopName : shop.shopName
                                }

                                db.updateOne(User, temp, user, function(flag){
                                });
                            }
                        });

                        var usernameLink = "/profile/" + req.session.username;
                        res.redirect(usernameLink);
                    }
                });  
            }
        });
    },

    getShopName : function (req, res){

        var shopName = req.query.shopName;

        db.findOne(Shop, {shopName : shopName}, 'shopName', function(result){
            console.log("------------result-----------------");
            console.log(result);
            if(result != null){
                res.send(result);
            }
            else{
                res.send('');
            }   
        });
    }
}
module.exports = editShopController;
