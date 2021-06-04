
$(document).ready(function () {

    function isFilled() {

        var username = validator.trim($('#username').val());
        var email = validator.trim($('#email').val());
        var password = validator.trim($('#password').val());
        var fName = validator.trim($('#fName').val());
        var lName = validator.trim($('#lName').val());
        var telnum = validator.trim($('#contactno').val());
        var address = validator.trim($('#address').val());

        /*
            checks if the trimmed values in fields are not empty
        */
        var usernameEmpty = validator.isEmpty(username);
        var emailEmpty = validator.isEmpty(email);
        var passwordEmpty = validator.isEmpty(password);
        var fNameEmpty = validator.isEmpty(fName);
        var lNameEmpty = validator.isEmpty(lName);
        var telnumEmpty = validator.isEmpty(telnum);
        var addressEmpty = validator.isEmpty(address);

        return !usernameEmpty && !emailEmpty && !passwordEmpty && !fNameEmpty && !lNameEmpty && !telnumEmpty && !addressEmpty;
    }

    function isValidPassword(field, callback){
        var validPassword= false;

        var password = validator.trim($('#password').val());
        var isValidLength = validator.isLength(password, {min: 8});

        if (isValidLength){
            if(field.is($('#password')))
                $('#passwordError').text('');
            
            validPassword = true;
        }
        else{
            if(field.is($('#password')))
                $('#passwordError').text('Passwords should contain at least 8 characters.');
        }

        return validPassword;
    }

    function isValidUsername(field, callback){
        var username =  validator.trim($('#username').val());

        $.get('/getUsername', {username :username}, function(result){
            if(result.username == username) {
                if (field.is($('#username'))) {
                    $('#usernameError').text('Username exists!');
                }
                return callback(false);
            }
            else {
                if (field.is($('#username'))) {
                    $('#usernameError').text('');
                }
                return callback(true);
            }
        });
    }

    function validateField(field, fieldName, error) {

        var value = validator.trim(field.val());
        var empty = validator.isEmpty(value);

        if(empty) {
            field.prop('value', '');
            error.text(fieldName + ' should not be empty.');
        }
        else
            error.text('');
        
        var filled = isFilled();
        var validPassword = isValidPassword (field);
        
        isValidUsername(field, function(validUser){
            if (filled && validPassword && validUser) {
                $('#submit').prop('disabled', false);
            } else {
                $('#submit').prop('disabled', true);
            }
        });
    }

    $('#username').keyup(function () {
        validateField($('#username'), 'Username', $('#usernameError'));
    });

    $('#email').keyup(function () {
        validateField($('#email'), 'Email', $('#emailError'));
    });

    $('#password').keyup(function () {
        validateField($('#password'), 'Password', $('#passwordError'));
    });

    $('#fName').keyup(function () {
        validateField($('#fName'), 'First Name', $('#fNameError'));
    });

    $('#lName').keyup(function () {
        validateField($('#lName'), 'Last Name', $('#lNameError'));
    });

    $('#contactno').keyup(function () {
        validateField($('#contactno'), 'Contact Number', $('#contactnoError'));
    });

    $('#address').keyup(function () {
        validateField($('#address'), 'Address', $('#addressError'));
    });
});