
const db = require('../models/db.js');

const User = require('../models/UserModel.js');

const { validationResult } = require('express-validator');

const bcrypt = require ('bcrypt');
const saltRounds = 10;

const signupController = {


    getRegister: function (req, res) {
        if (req.session.username){
            res.redirect('/home');
        }
        else{
            res.render('Register');
        }
    },

   
    postRegister: function (req, res) {

        var errors = validationResult(req);

        if(errors.isEmpty()){
   
           var username = req.body.username;
           var email = req.body.email;
           var password = req.body.password;
           var fname = req.body.fName;
           var lname = req.body.lName;
           var contactno = req.body.contactno;
           var address = req.body.address;
           var userPic = req.body.userPic
           console.log(userPic)
           
           bcrypt.hash (password, saltRounds, function(err, hash){

                var user = {
                    username: username,
                    email: email,
                    password: hash,
                    fname : fname,
                    lname : lname,
                    contactno : contactno,
                    address: address,
                    shopName : "",
                    userPic: userPic
                }
            
                db.insertOne(User, user, function(flag) {
                    if(flag) {
                        res.redirect('/login');
                }
                });
        
            });
        }
        else{
            errors = errors.errors;

            var details = {};

            for(i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;

            res.render('Register', details);
        }
        
        
    },

    getUsername : function (req, res){

        var username = req.query.username;

        db.findOne(User, {username:username}, 'username', function(result){
            if(result != null){
                res.send(result);
            }
            else{
                res.send('');
            }   
        });
    }
}

/*
    exports the object `signupController` (defined above)
    when another script exports from this file
*/
module.exports = signupController;
