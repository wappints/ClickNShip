$(document).ready(function () {

    function isFilled() {

        var username = validator.trim($('#username').val());
        var password = validator.trim($('#password').val());

        var usernameEmpty = validator.isEmpty(username);
        var passwordEmpty = validator.isEmpty(password);

        return !usernameEmpty && !passwordEmpty;
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

        if (filled) {
            $('#submit').prop('disabled', false);
        } else {
            $('#submit').prop('disabled', true);
        }
    }

    $('#username').keyup(function () {
        validateField($('#username'), 'Username', $('#usernameError'));
    });

    $('#password').keyup(function () {
        validateField($('#password'), 'Password', $('#passwordError'));
    });
});