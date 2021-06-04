$(document).ready(function () {

    var oldUsername = "";

    function isFilled() {

        var username = validator.trim($('#username').val());
        var email = validator.trim($('#email').val());
        var fName = validator.trim($('#fname').val());
        var lName = validator.trim($('#lname').val());
        var telnum = validator.trim($('#contactno').val());
        var address = validator.trim($('#address').val());

        /*
            checks if the trimmed values in fields are not empty
        */
        var usernameEmpty = validator.isEmpty(username);
        var emailEmpty = validator.isEmpty(email);
        var fNameEmpty = validator.isEmpty(fName);
        var lNameEmpty = validator.isEmpty(lName);
        var telnumEmpty = validator.isEmpty(telnum);
        var addressEmpty = validator.isEmpty(address);

        return !usernameEmpty && !emailEmpty && !fNameEmpty && !lNameEmpty && !telnumEmpty && !addressEmpty;
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

        var username =  validator.trim($('#username').val());
        if(username != oldUsername){
            isValidUsername(field, function(validUser){
                if (filled && validUser) {
                    $('#submitBtn3').prop('disabled', false);
                } else {
                    $('#submitBtn3').prop('disabled', true);
                }
            });
        }
        else{
            if (filled) {
                $('#submitBtn3').prop('disabled', false);
            } else {
                $('#submitBtn3').prop('disabled', true);
            }
        }

    }

    $('#username').keyup(function () {
        validateField($('#username'), 'Username', $('#usernameError'));
    });

    $('#email').keyup(function () {
        validateField($('#email'), 'Email', $('#emailError'));
    });

    $('#fname').keyup(function () {
        validateField($('#fname'), 'First Name', $('#fNameError'));
    });

    $('#lname').keyup(function () {
        validateField($('#lname'), 'Last Name', $('#lNameError'));
    });

    $('#contactno').keyup(function () {
        validateField($('#contactno'), 'Contact Number', $('#telError'));
    });

    $('#address').keyup(function () {
        validateField($('#address'), 'Address', $('#addressError'));
    });

    if (isFilled()){
        $('#submitBtn3').prop('disabled', false);
        oldUsername = $('#username').val()
    }
});