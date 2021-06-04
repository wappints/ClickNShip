$(document).ready(function () {

    function isFilled() {

        var productName = validator.trim($('#pname').val());
        var price = validator.trim($('#price').val());
        var stock = validator.trim($('#stock').val());

        var productNameEmpty = validator.isEmpty(productName);
        var priceEmpty = validator.isEmpty(price);
        var stockNameEmpty = validator.isEmpty(stock);

        return !productNameEmpty && !priceEmpty && !stockNameEmpty
    }

    function validateCategory(field, callback){
        var category = $('#category').val();
        console.log(category)
        if (category != "NA")
            return true;
        else
            $('#categoryError').text('Choose a Category!');
        
        return false;
    }

    function validatePrice(field, callback){
        var price = $('#price').val();

        if (price >= 0)
            return true;
        else
            $('#priceError').text('Invalid Price Input!');
        
        return false;
    }

    function validateStock(field, callback){
        var stock = $('#stock').val();

        if (stock >= 0)
            return true;
        else
            $('#stockError').text('Invalid Stock Input!');
        
        return false;
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
        var validCat = validateCategory(field);
        var validPrice = validatePrice(field);
        var validStock = validateStock (field);

        if (filled && validCat && validPrice && validStock) {
            $('#submit').prop('disabled', false);
        } else {
            $('#submit').prop('disabled', true);
        }
    }

    $('#pname').keyup(function () {
        validateField($('#pname'), 'Product name', $('#productNameError'));
    });

    $('#price').keyup(function () {
        validateField($('#price'), 'Price', $('#priceError'));
    });

    $('#stock').keyup(function () {
        validateField($('#stock'), 'Stock', $('#stockError'));
    });
    
    $('#category').change(function () {
        validateField($('#category'), 'Category', $('#categoryError'));
    });

    if (isFilled()){
        $('#submitBtn3').prop('disabled', false);
        oldUsername = $('#username').val()
    }
});