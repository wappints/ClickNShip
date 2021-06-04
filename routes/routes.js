// import module `express`
const express = require('express');

// import module `controller` from `../controllers/controller.js`
const controller = require('../controllers/controller.js');

// import module `cartController` from `../controllers/signupController.js`
const cartController = require('../controllers/cartController.js');

const signupController = require('../controllers/signupController.js');

const loginController = require('../controllers/loginController.js');

const editShopController = require('../controllers/editShopController.js');

const editItemController = require('../controllers/editItemController.js');

const shopController = require('../controllers/shopController.js');

const manageProductsController = require('../controllers/manageProductsController.js');

const viewshopController = require('../controllers/viewshopController.js');

const editProfileController = require('../controllers/editProfileController.js');

const profileController = require('../controllers/profileController.js'); 

const validationSignUp = require('../helpers/validationSignUp.js');

const validationLogIn = require('../helpers/loginValidation.js');


const app = express();

const db = require('../models/db.js');
const Item = require('../models/ItemModel.js');
const upload = require('../utils/multer'); 

app.get('/favicon.ico', controller.getFavicon);

app.get('/', loginController.getLogin);

//REGISTER
app.get('/register', signupController.getRegister);
app.post('/register', validationSignUp.signupValidation(), signupController.postRegister);
app.get('/getUsername', signupController.getUsername);

//LOGIN
app.get('/login', loginController.getLogin);
app.post('/login', validationLogIn.loginValidation(), loginController.postLogin);

//LOGOUT
app.get('/logout', profileController.getLogOut);

//HOME
app.get('/home', shopController.getIndex);

//VIEW PROFILE
app.get('/profile/:username', profileController.getProfile);

//CREATE OR EDIT SHOP
app.get('/editShop', editShopController.getShopEditor);
app.post('/editShop', upload.single('image'), editShopController.postShopEdit);
app.get('/getShopName', editShopController.getShopName);


app.get('/shop/:shopname', viewshopController.getShop);
//CREATE OR EDIT SHOP

app.get('/editItem/:id', editItemController.getItemEditor);
app.get('/addItem', editItemController.getItemEditor);
app.post('/editItem/:_id', upload.single('image'), editItemController.postItemEdit);
//app.post('/editItem/', upload.single('image'), editItemController.postItemEdit);

//CHECKOUT
app.get('/checkout',cartController.getCart);
app.get('/delete', cartController.removeItem);
app.get('/deleteAll', cartController.removeAll);

// MANAGE PRODUCTS
app.get('/manageProducts/:shopName', manageProductsController.getProducts);
app.get('/deleteProduct', manageProductsController.removeProduct);

// EDIT PROFILE
app.get('/editProfile', editProfileController.getDetails);
app.post('/editProfile', upload.single('image'), editProfileController.postDetails);

//CLICK ITEM
app.get('/viewitem/:_id/:itemName', shopController.getItem);    
app.post('/checkout', cartController.insertItem);
app.get('/like', shopController.likeItem)
app.get('/unlike', shopController.unlikeItem)
app.get('/addComment', shopController.addComment); 
app.get('/deleteComment', shopController.deleteComment)

//SEARCH
app.get('/search', shopController.getSearch); 

//CATEGORY
app.get('/category/:category', shopController.getCategory)
//app.get('/:category', shopController.getCategory)

//
module.exports = app;  
