const db = require('../models/db.js');

const User = require('../models/UserModel.js');
const Shop = require('../models/ShopModel.js');

const cloudinary = require('../utils/cloudinary'); 
const upload = require('../utils/multer'); 
const editProfileController = {

    getDetails: function (req, res) {
        if (req.session.username){
            var username = req.session.username;
            console.log(username);
            db.findOne(User, {username : username}, {}, function(result){
                //if edit item
                console.log(result);
                if (result != null)
                {
                    var details = {
                        username : result.username,
                        email : result.email,
                        fname : result.fname,
                        lname : result.lname,
                        contactno : result.contactno,
                        address : result.address,
                        userPic: result.userPic,
                        public_id: result.public_id,
                        usernameLink : "/profile/" + username
                    };
                    console.log(details.userPic)
                    res.render('editProfile', details)
                }
                else 
                    res.render('editProfile');
            });
        }
        else{
            res.redirect('/login');
        }

    },

    postDetails: async function (req, res) {

        var username = req.body.username;
        var email = req.body.email;
        var fname = req.body.fname;
        var lname = req.body.lname;
        var contactno = req.body.contactno;
        var address = req.body.address;

        console.log("username: " + username)
        console.log("old user pic: " + req.body.userPic)

        
        if (typeof req.file !== 'undefined'){ //if image is not empty, upload
            try{
                var img = await cloudinary.uploader.upload(req.file.path);
                var userPic =  img.url;
                var public_id = img.public_id; 
                console.log("user pic: " + userPic)
               
            } catch(err){
                console.log(err)
            }
        }
        console.log("USER PIC FROM UPLOAD: " + userPic); 

        var user = { //the changes
            username : username,
            email : email,
            fname : fname,
            lname : lname,
            contactno : contactno,
            address : address,
            userPic: userPic,
            public_id: public_id
        }
        var temp = {
            username : req.session.username
        };

        db.findOne(User, temp, {}, function(result){
            if (result != null){

                var details = { //things to change
                    username : result.username,
                };
                
                console.log("OLD USER PIC: " + details.userPic)
                
                if (typeof req.file == 'undefined'){
                     user.userPic = result.userPic;
                     user.public_id = result.public_id; 
                 }

                
                //model , things to change, the changes 
                db.updateOne(User, details, user, function(flag){
                    
                    if(flag){
                        if(req.session.username != user.username){
                            req.session.username = user.username;
                            projection = 'username'

                            db.findOne(Shop, temp, projection, function(result){
                                if (result != null){
                                    shopDetails = {
                                        username : result.username
                                    }
                                    shop = {
                                        username : user.username
                                    }
                                    db.updateOne(Shop, shopDetails, shop, function (flag){
                                    });
                                }
                            });
                        }

                        var usernameLink = "/profile/"+ user.username;
                        res.redirect(usernameLink);
                    }
                });
               
            }
        });
    }
}
module.exports = editProfileController;
