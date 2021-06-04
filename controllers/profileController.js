
// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/UserModel.js');

/*
    defines an object which contains functions executed as callback
    when a client requests for `signup` paths in the server
*/
const profileController = {

    getProfile: function (req, res) {

        if (req.session.username){
            var flag = false;

            if(req.session.username == req.params.username)
                flag = true;

            var query = {username : req.params.username};

            //var projection = 'username fname lname email contactno address shopName'
            
            db.findOne(User, query, {}, function(result) {
                if(result != null) {
                    var shopFlag = false;
                    var shopLink = "";
                    if (result.shopName != ""){
                        shopFlag = true;
                        shopLink = "/shop/" + result.shopName;
                    }

                    var details = {
                        username : result.username,
                        fName : result.fname,
                        lName : result.lname,
                        email : result.email,
                        contactNo : result.contactno,
                        address : result.address,
                        flag : flag,
                        usernameLink : "/profile/" + req.session.username,
                        shopFlag : shopFlag,
                        shopLink : shopLink,
                        shopName : result.shopName,
                        userPic: result.userPic,
                        upvote: result.upvote,
                        downvote: result.downvote
                    };

                    console.log(details);
                    res.render('viewprofile', details);
                }
            });
        }

        else{
            res.redirect('/login');
        }
    }, 

    getLogOut: function (req, res) {

        req.session.destroy(function(err) {
            if(err) throw err;

            res.redirect('/');
        });

    }
}

module.exports = profileController;
