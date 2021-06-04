$(document).ready(function () {

    function isFilled() {

        var searchBar = validator.trim($('#searchbar').val());

        return !searchBar;
    }

    function validateField(field) {

        var value = validator.trim(field.val());
        var empty = validator.isEmpty(value);
        
        var filled = isFilled();

        if (filled) {
            $('#submit').prop('disabled', false);
        } else {
            $('#submit').prop('disabled', true);
        }

    }

    $('#searchbar').keyup(function () {
        validateField($('#searchbar'));
    });
});