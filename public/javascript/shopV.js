$(document).ready(function () {

    var oldShopName = "";

    function isFilled() {

        var shopName = validator.trim($('#sname').val());

        var shopNameEmpty = validator.isEmpty(shopName);

        return !shopNameEmpty;
    }

    function isValidShopName(field, callback){
        var shopName =  validator.trim($('#sname').val());

            $.get('/getShopName', {shopName : shopName}, function(result){
                if(result.shopName == shopName) {
                    if (field.is($('#sname'))) {
                        $('#shopNameError').text('Username exists!');
                    }
                    return callback(false);
                }
                else {
                    if (field.is($('#sname'))) {
                        $('#shopNameError').text('');
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
        var shopName = validator.trim($('#sname').val());

        if(shopName != oldShopName){
            isValidShopName(field, function(validShop){
                if (filled && validShop) {
                    $('#submit').prop('disabled', false);
                } else {
                    $('#submit').prop('disabled', true);
                }
            });
        }
        else{
            if (filled) {
                $('#submit').prop('disabled', false);
            } else {
                $('#submit').prop('disabled', true);
            }
        }
    }
    $('#sname').keyup(function () {
        validateField($('#sname'), 'Shop Name', $('#shopNameError'));
    });

    if(isFilled()){
        $('#submit').prop('disabled', false);
        oldShopName = $('#sname').val()
    }
});