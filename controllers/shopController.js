// import module from `../models/db.js`
const db = require('../models/db.js');
const Item = require('../models/ItemModel.js');
const Shop = require('../models/ShopModel.js');
const User = require('../models/UserModel.js');
const Comment = require('../models/CommentModel.js');
var mongoose = require('mongoose');

/*
    defines an object which contains functions executed as callback
    when a client requests for a certain path in the server
*/
const shopController = {

    getItem: function(req, res){
        var loggeduser = req.session.username;
        console.log("Logged user is " + loggeduser)
        var id = req.params._id;
        if (id[0] == ':')
            id = id.substring(1);
        var itemName = req.params.itemName; 
        var itemPic = req.params.itemPic;
        var shopName = req.params.shopName;
        console.log(itemName); 
        console.log(id); 
        var upvote = []
        console.log("1SUCCESS")
        console.log(id)
        var usernameLink = "/profile/" + req.session.username;
        var username = req.session.username

        db.findOne(User, {username: req.session.username}, {}, function(result){
            //console.log(result)
            upvote = result.upvote;
            downvote = result.downvote;
            fullname = result.name; 
            userPic = result.userPic;
            
        })
         
        db.findOne(Item, {_id : id}, {}, function(result){
            //console.log(result)
            if(result != null){
                var item = result; 
                console.log(result)
                comments = result.comments; 
                console.log(result)

                // console.log( result.upvote.length)
                // for (var i = 0; i < result.upvote.length; i++){ 
                //     console.log(i)
                // }

                db.findOne(Shop, {'shopName' : result.shopName}, {} , function(result){

                    var shop = result;
                    console.log("FOUND SHOP?")
                    temp ={
                        _id: item._id,
                        itemName: item.itemName,
                        itemPic: item.itemPic, 
                        itemPrice: item.itemPrice,
                        description: item.description, 
                        upvote: item.upvote,
                        downvote: item.downvote, 
                        stocks: item.stocks,
                        sold: item.sold,
                        category: item.category,
                        
                        shopName: shop.shopName,
                        shopPic: shop.shopPic,
                        userUpvote: upvote,
                        userDownvote: downvote,
                        usernameLink: usernameLink,
                        username: username,
                        fullname: fullname, 
                        userPic: userPic,
                        comments: comments,
                        loggeduser : loggeduser
                    }
                    console.log(loggeduser + " THIS IS LOGGED USER")
                    console.log("\n\n\nUSER PIC" + temp.userPic)
                    res.render('viewitem', temp)
                })

            } else
                res.send('meow'); 
        })

    },

    getIndex: function (req, res) {
        var item = []

        if (req.session.username){ //if logged in
            var accessories = []
            var beauty = []
            var clothing = []
            var homeL = []
            var technology = []

            usernameLink = "/profile/"+req.session.username
            db.findMany(Item, {}, {}, function(result){
                item = result;  
                item.sort((a, b) => parseInt(b.sold) - parseInt(a.sold));

                db.findMany(Item, {category: "Beauty"}, {}, function(result){
                    beauty = result; 
                    //console.log(beauty)
                    db.findMany(Item, {category: "Accessories"}, {}, function(result){
                       
                        accessories = result;   
                        db.findMany(Item, {category: "Home & Lifestyle"}, {}, function(result){
                            homeL = result;    
                            db.findMany(Item, {category: "Clothing"}, {}, function(result){
                                clothing = result;     
                                db.findMany(Item, {category: "Technology"}, {}, function(result){
                                    technology = result; 
            
                                    item = item.slice(0,5)
                                    accessories = accessories.slice(0,5)
                                    beauty = beauty.slice(0,5)
                                    clothing = clothing.slice(0,5)
                                    technology = technology.slice(0,5)
                                    homeL = homeL.slice(0,5)
                                    res.render('home', {item: item, accessories: accessories, beauty: beauty, clothing: clothing, homeL: homeL, technology: technology, usernameLink: usernameLink});
                                }) 
                            })  
                        })   
                    }) 
                });
            
            })
        } else{
            res.redirect('/login');
        }
    
    },


    getSearch: function(req, res){
        if(req.session.username){
            key = req.query.key; 
            key = key.trim();
            var item =[]
            q = {"itemName":  { $regex: key, $options: "i"}}; 
            shop = {"shopName":  { $regex: key, $options: "i"}};

            db.findMany(Item, q, {}, function(result){
                console.log(result.length)
                item = result; 

                db.findMany(Shop, shop, {}, function(result){
                    shop = result; 
                    res.render('search', {item:item, key:key, shop: shop}); 

                })
                
            });
        }
        else{
            res.redirect('/login');
        }
    },

    getCategory: function(req, res){
        if(req.session.username){
            console.log(req.params.category); 
            var category = req.params.category;
            var item = []

            db.findMany(Item, {'category': category}, null, function(result){
                if (result != null){
                    console.log('got items'); 
                    item = result;
                    details = {
                        item : item,
                        category : category,
                        usernameLink : "/profile/" + req.session.username
                    };
                    res.render('category', details);
                }
            });
        }
        else{
            res.redirect('/login');
        }
    }, 

    likeItem: function(req, res){
        var _id = req.query._id; 
        var upvote = parseInt(req.query.upvote); 
        var downvote = req.query.downvote; 
        var liked = parseInt(req.query.liked); 
        var unliked = parseInt(req.query.unliked); 

        console.log("\n\nLIKED: " + liked); 
        console.log("UNLIKED: " + unliked); 

        console.log('\n\n\nin like, id: ' + _id );
        console.log(upvote)
        console.log(downvote)

        db.findOne(Item, {'_id' : _id}, {}, function(result){
            if(result != null){
                console.log("found")
               // console.log(result)

                var update ={
                    _id: _id
                }

                if (liked == 1){ //if liked, add to user upvote and +1 to item upvotes
                    db.updateOne(Item, update, { $set: {upvote: upvote+1, downvote: downvote}}, function(flag){
                        console.log("updated")
                        // if(flag){
                        //     res.send('Updated item!')
                        // }
                    })
    
                    db.updateOne(User, {username: req.session.username}, {$push: {upvote: update}}, function(flag){
                        console.log("updated")
                    } )
                } 
                
                if (unliked == 1){
                    db.updateOne(Item, update, { $set: { downvote: downvote-1}}, function(flag){
                        console.log("updated")
                    })
    
                    db.updateOne(User, {username: req.session.username}, {$pull: {downvote: _id}}, function(flag){
                        console.log("updated DOWNVOTE")
                    } )
                }   
            }
        })
    },

    unlikeItem: function(req, res){
        var _id = req.query._id; 
        var upvote = parseInt(req.query.upvote); 
        var downvote = parseInt(req.query.downvote); 
        var liked = parseInt(req.query.liked);
        var unliked =   parseInt(req.query.unliked);
        console.log(liked)

        console.log('\n\n\nin like, id: ' + _id );
        console.log(upvote)
        console.log(downvote)

        db.findOne(Item, {'_id' : _id}, {}, function(result){
            if(result != null){
                console.log("found")
               // console.log(result)

                var update ={
                    _id: _id
                }

                if (unliked == 1){ //if unliked, add to user upvote and +1 to item downvote
                    db.updateOne(Item, update, { $set: {upvote: upvote, downvote: downvote+1}}, function(flag){
                        console.log("updated")
                        console
                        // if(flag){
                        //     res.send('Updated item!')
                        // }
                    })
    
                    db.updateOne(User, {username: req.session.username}, {$push: {downvote: update}}, function(flag){
                        console.log("updated")
                    } )
                } 
                
                if (liked == 1){
                    db.updateOne(Item, update, { $set: {upvote: upvote-1}}, function(flag){
                        console.log("updated")
                       
                    })
    
                    db.updateOne(User, {username: req.session.username}, {$pull: {upvote: _id}}, function(flag){
                        console.log("updated UPVOTE")
                    } )
                }   
            }
        })
    },

    addComment: function(req, res){
        var username = req.query.username; 
        var itemID = req.query.itemID; 
        //var userPic = req.query.userPic; 
        var comment = req.query.text_field; 
        console.log("IN ADD COMMENT"); 
        itemID =  mongoose.Types.ObjectId(itemID)
        //console.log(userPic)

        var loggeduser = req.session.username;
        console.log("LOGGED USER ADDING IS " + loggeduser)
        var info = {
            username: username, 
            userPic: userPic, 
            comment: comment
        }
        
        db.findOne(Item, {_id: itemID}, {}, function(result){
            if (result != null){
                console.log("found")
                //console.log(result)
                var item = result; 
                
               
                    db.insertOne(Comment, info, function(flag){
                        console.log("updated?")
                        db.findOne(Comment, info, {}, function(result)
                        {
                            var IDD = result;
                            db.updateOne(Item, {_id: item._id}, {$push: {comments: IDD}}, function(flag)
                            {
                                if (flag)
                                db.findOne(User, {username: username}, {}, function(result){
                                    userPic = result.userPic; 
                                        console.log(loggeduser)
                                        res.render('viewitem', {item : item, userPic : userPic, loggeduser : loggeduser})
                                   
                                })
                            })
                        })
             
                     
                    })
                    
                    

            }
           
        })
    }, 

    deleteComment: function (req, res) {
        // your code here
        var id= req.query._id;
        var itemID = req.query.id;
        console.log(itemID)
        console.log(id)
        db.findOne(Item, {_id : itemID}, {}, function(result)
        {
            console.log(result._id)
            var itemcomments = result
            console.log(itemcomments)
            var all = result;
            id = id.trim()
            db.findOne(Comment, {_id : id}, {}, function(result)
            {
                var comments = result; 
                var arraytemp = [];
                console.log("YO")
                
                console.log(comments)
                for (var i = 0; i < itemcomments.comments.length; i++)
                {
                    console.log("itemcomments[i] is " + itemcomments.comments[i].comment )
                    console.log("comments.comment is " + comments.comment )
                    if (!(comments.comment == itemcomments.comments[i].comment))
                    {
                        arraytemp.push(itemcomments.comments[i].comment)
                    }
                    else
                        index = i;
                    console.log("THE LAMAN OF ARRAYTEMP")
                    console.log(arraytemp)
                }
                console.log("BEFORE")
                console.log(all.comments)
                console.log(index)
                all.comments.splice(index, 1)
                console.log("AFTER")
                console.log(all.comments)
                for (i = 0; i < all.comments.length; i++)
                {
                        all.comments[i].comment = arraytemp[i];
                        console.log(all.comments[i])
                }
               
                db.updateOne(Item, {_id: itemID},  {comments : all.comments},  function(flag){
                    

                        console.log(flag)
                        db.deleteOne(Comment, {_id : id}, function(result)
                        {
                            res.send(result);
                        });
                })
            })

        })
    }
}

    
/*
    exports the object `controller` (defined above)
    when another script exports from this file
*/
module.exports = shopController;
