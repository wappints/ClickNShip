const { check } = require('express-validator');

const loginValidation = {
    loginValidation: function () {

        var validation = [

            check('username', 'First name should not be empty.').notEmpty(),

            check('password', 'Password should not be empty.').notEmpty()
        ];
        return validation;
    }
}

module.exports = loginValidation;