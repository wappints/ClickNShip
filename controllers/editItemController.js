const fs = require('fs');

const db = require('../models/db.js');

const Item = require('../models/ItemModel.js');

const User = require('../models/UserModel.js');
const Shop = require('../models/ShopModel.js');

const cloudinary = require('../utils/cloudinary'); 
const upload = require('../utils/multer'); 

const editItemController = {

    getItemEditor: function (req, res) {
        
        
        var shopName = req.params.shopName
        var _id = req.params.id;
        
     
        console.log("\n\nSHOPNAME " + shopName)
        console.log("\n\nitem pic:" + itemPic)
        console.log(_id)
        
        //console.log(pic)
        if (_id != null){ //if existing item
            var itemPic = req.params.itemPics;
            var temp = req.params.id;

            db.findOne(Item, {_id : temp}, {}, function(result){
                //if edit item
                //console.log(result)
                console.log("FINDING ITEM")
    
                if (result != null){
                    var details = {
                        _id : result._id,
                        itemName : result.itemName,
                        shopName : result.shopName,
                        upvote : result.upvote,
                        downvote : result.downvote,
                        stocks : result.stocks,
                        itemPrice : result.itemPrice,
                        description : result.description,
                        sold : result.sold,
                        category : result.category,
                        itemPic: result.itemPic,
                        publicId : result.public_id
                    };
                    console.log("PRINT DETAILS ")
                    console.log(details)
                    res.render('AddEditItem', details)
                }
                
            }); 
        } else  { //if add item
            db.findOne(User, {username : req.session.username}, {}, function(result){
                console.log("ADD ITEM")

                if(result){
                    var details = {
                        shopName : result.shopName,
                        _id: 999999
                    }
                    console.log("SHOP NAME         " + details.shopName)
                    res.render('AddEditItem', details);
                }
            });
        }     
    
    },

    postItemEdit: async function (req, res) { 
        console.log("\n\n\nIN POST EDIT") 

        var _id = req.params._id;
        var itemName = req.body.itemName;
        var itemPrice =  req.body.itemPrice;
        var stocks = req.body.stock;
        var category = req.body.category;
        var description = req.body.description;
        console.log(_id);
        var shopName = req.body.shopName
        console.log(req.body.shopName)
        console.log(_id);

        var itemPic = req.body.itemPic
        console.log("ITEM PIC" + itemPic)
        

        if (typeof req.file !== 'undefined'){ //if image is not empty, upload
            try{
                var img = await cloudinary.uploader.upload(req.file.path);
                itemPic =  img.url;
                var public_id = img.public_id; 
                           
            } catch(err){
                console.log(err)
                }
        }

        console.log("ITEM PIC LINK" + itemPic)
        
        if(_id != 999999){

            db.findOne(Item, {_id : _id}, {}, function(result){ //find item in elements
                console.log("ITEM FOUND")
                if (typeof req.file == 'undefined'){
                    itemPic = result.itemPic;
                  
                }
                
                if(result != null)
                {
                    console.log("SUCCESS UPDATED")
                    updates = {
                        itemName: itemName, 
                        category: category,
                        stocks: stocks, 
                        description: description,
                        itemPrice: itemPrice,
                        itemPic: itemPic
                    }
                    console.log(updates)
                    //model , things to change, the changes 
                    db.updateOne(Item, {_id : _id }, { $set: updates}, function(flag){ 
                        
                        if(flag) {
                            console.log(result.shopName)
                            res.redirect('/manageProducts/' + result.shopName);
                        }
                    });
                } 
            })
        }
                else {
                    console.log(shopName)
                    console.log("ITEM DOES NOT EXIST. CREATE ITEM")
                   
                    console.log(req.session.username)

                    console.log(shopName)
                    var itemPic = req.params.itemPic

                    if (typeof req.file !== 'undefined'){ //if image is not empty, upload
                        try{
                            var img = await cloudinary.uploader.upload(req.file.path);
                            var itemPic =  img.url;
                            var public_id = img.public_id; 
                           
                        } catch(err){
                            console.log(err)
                        }
                    }

                    console.log("ITEM PIC:" + itemPic)
                    
                    //console.log(item)

                    db.findOne(User, {username : req.session.username}, {}, function(result){
                        
                        console.log(result)
                        item = { //the changes
                            itemName : itemName,
                            itemPrice : itemPrice,
                            stocks : stocks,
                            category : category,
                            description : description,
                            shopName: result.shopName,
                            sold : 0,
                            upvote : 0, 
                            downvote : 0, 
                            itemPic: itemPic
                        }

                        console.log(item)
                        

        
                        db.insertOne(Item, item, function(flag) {
                            if (flag){
                                console.log("inserting")

                                info = {
                                    itemName : item.itemName, 
                                    shopName: item.shopName
                                }

                                db.findOne(Item, info, {}, function(result) {
                                    var ID = result._id
             
                                    db.updateOne(Shop, {shopName : item.shopName}, { $push: {itemID : ID}}, function(result)
                                    {
             
                                     console.log(flag)
                                     if(flag) {
                                         res.redirect('/manageProducts/' + item.shopName);
                                     }
                                    })
                                 })


                            }
                        });
                    }); 
                }

    }
}
module.exports = editItemController;
