
// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/UserModel.js');

const bcrypt = require ('bcrypt');

const { validationResult } = require('express-validator');

/*
    defines an object which contains functions executed as callback
    when a client requests for `signup` paths in the server
*/
const loginController = {

  
    getLogin: function (req, res) {

        if(req.session.username){
            var details = {
                usernameLink : "/profile/" + req.session.username
            }
            res.redirect('/home');
        }
        else
            res.render('Login');
    },

    postLogin: function (req, res) {

        var errors = validationResult(req);

        if(errors.isEmpty()){
            var username = req.body.username;
            var password = req.body.password;

            var user = {
                username: username,
            }

            var projection = 'username password';

            db.findOne(User, user, projection, function(result){
                if (result != null){
                    bcrypt.compare(password, result.password, function(err, equal){

                        if(equal){
                            req.session.username = user.username;
                            res.redirect('/home');
                        }
                        else{
                            var details = {
                                loginError : `Username and/or Password is incorrect.`
                            }
                            res.render("Login", details);
                        }

                    });
                }
                else{
                    var details = {
                        loginError : `Username and/or Password is incorrect.`
                    }
                    res.render("Login", details);
                }
            });
        }
        else{
            errors = errors.errors;

            var details = {};

            for(i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;

            res.render('Login', details);
        }
    }
}

module.exports = loginController;
