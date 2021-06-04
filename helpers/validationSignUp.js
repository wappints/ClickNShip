const { check } = require('express-validator');

const validationSignUp = {
    signupValidation: function () {

        var validation = [

            check('username', 'First name should not be empty.').notEmpty(),

            check('password', 'Password should contain at least 8 characters.')
            .isLength({min: 8}),

            check('email', 'Email should not be empty.').notEmpty(),

            check('fName', 'First Name should not be empty.').notEmpty(),

            check('lName', 'Last name should not be empty.').notEmpty(),

            check('contactno', 'Contact Number name should not be empty.').notEmpty(),

            check('address', 'Address should not be empty.').notEmpty(),
        ];
        return validation;
    }
}

module.exports = validationSignUp;