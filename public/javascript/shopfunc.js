

$(document).ready(function(){
    var username = $('#username');

    if(username )
    console.log($('#userUpvote').text())
    var temp = $('#userUpvote').text().split(",")
    var tempDownvote = $('#userDownvote').text().split(",")
    console.log("meow")
    console.log(temp)

    var liked = 0; 
    var unliked = 0; 
    var upvoteClick = 0; 
    var downvoteClick = 0; 

    var _id = $('#_id').text(); 

    for (var i = 0; i < temp.length; i ++){
        if(temp[i].localeCompare(_id) == 0){
            $('#my_like').css("color", "#008000");  
             liked = 1; 
            console.log("found")
            
        } else {
            console.log("not found");
        }
    }

    console.log("DOWNVOTE")
    for (var i = 0; i < tempDownvote.length; i ++){
        if(tempDownvote[i].localeCompare(_id) == 0){
            $('#my_unlike').css("color", "#ff0000");  
             unliked = 1; 
            console.log("found")
            
        } else {
            console.log("not found");
        }
    }
    console.log("\n\nUNLIKED VALUE: " + unliked)

    $('.btn.btn-warning.add_to_cart.mt-3').attr('disabled',true); 

    $('#my_like').click(function(){
        var _id = $('#_id').text(); 
        var upvote = parseInt($('#upvote').text()); 
        var downvote = parseInt($('#downvote').text()); 
        console.log("\n\n\n TEMP  " + temp.length)
        upvoteClick += 1; 

        for (var i = 0; i < temp.length; i ++){
            if(temp[i].localeCompare(_id) == 0){
                $('#my_like').css("color", "#008000");  
                liked = 1; 
                console.log("found")
                
            } else {
                console.log("not found");
            }
        }

        
        if(liked != 1 && upvoteClick == 1){
            console.log("CALLING /LIKE") 
            $('#upvote').text(upvote+1); 
            $('#my_like').css("color", "#008000"); 
            liked = 1;  

            if (unliked == 1){
                $('#my_unlike').css("color", "#000000"); 
                $('#downvote').text(downvote-1); 
            }
            $.get('/like', {'_id': _id, upvote: upvote, downvote: downvote, liked: liked, unliked: unliked}, function(result){});
        } 
       
    }),  

    $('#my_unlike').click(function(){
        var _id = $('#_id').text(); 
        var upvote = parseInt($('#upvote').text()); 
        var downvote = parseInt($('#downvote').text()); 
        console.log("\n\n\n TEMP  " + temp.length)
        downvoteClick += 1; 

        for (var i = 0; i < tempDownvote.length; i ++){
            if(tempDownvote[i].localeCompare(_id) == 0){
                $('#my_unlike').css("color", "#ff0000");  
                unliked = 1; 
                console.log("found")
                
            } else {
                console.log("not found");
            }
        }

        if(unliked != 1 && downvoteClick == 1){
            console.log("CALLING /UNLIKE") 
            $('#downvote').text(downvote+1); 
            $('#my_unlike').css("color", "#ff0000"); 
            unliked = 1;  

            if (liked == 1){
                $('#my_like').css("color", "#000000"); 
                $('#upvote').text(upvote-1); 
            }
            $.get('/unlike', {'_id': _id, upvote: upvote, downvote: downvote, unliked: unliked, liked: liked,}, function(result){});
        } 
    }),

    $('#comment').click(function(){
        var username = $('#username');
        var itemID = $('#itemID'); 
        var userPic = $('#userPic'); 
        var text_field = $('#text_field'); 

        console.log(username.text())
        console.log(itemID.text())
        console.log(userPic.text())
        console.log(text_field.val())

        param = {
            username: username.text(),
            itemID: itemID.text(),
            userPic: userPic.text(),
            text_field: text_field.val()
        }
        $.get('/addComment', param, function(result){
            if(result){
                console.log(result.comments)
                console.log("tulog ka na girl"); 

                //containers
                var comments_section = document.getElementById('comments_section');
                comments_section.className = "flex flex-column"
                comments_section.id = "comments_section"; 

                var comment_container = document.createElement('div'); 
              
                comment_container.className = "d-flex my-2 comment_container"; 

                var namecomm_container = document.createElement('div');
                namecomm_container.className = "d-flex flex-column p-2 flex-fill"; 

                var temp = document.createElement("div")
                temp.className = "d-flex flex-fill p-1"; 

                var pic = document.createElement('img'); 
                pic.src = param.userPic; 
                pic.className = "comment_pic p-2";

                var pComment = document.createElement('p');
                pComment.innerHTML = param.text_field; 

                var pUsername =  document.createElement('a');
                pUsername.className = "comment_name";
                pUsername.innerHTML = param.username; 

                // var del =  document.createElement('button');
                // del.className = "btn btn-secondary edit_del_btn delete"
                // del.innerHTML = "Delete"

                namecomm_container.appendChild(pUsername); 
                namecomm_container.appendChild(pComment); 

                comment_container.appendChild(pic); 
                comment_container.appendChild(namecomm_container); 
                // comment_container.appendChild(del);

                comments_section.appendChild(comment_container); 
                $('#text_field').val('')
            }
        })
    })

    $('.btn.btn-secondary.edit_del_btn.delete').click((event) => { 
        
        var _id = event.currentTarget.parentElement.childNodes[1].innerText
        var itemID = document.getElementById("_id").innerText;

        console.log(_id);
        console.log(itemID);

   
    $.get('/deleteComment', {_id :_id, id : itemID}, function (result) {});

    
    $(event.target).parents('.row-lg-12').remove();
    });




})


function add_to_cart() {
    console.log('checkout time')
    var x = document.getElementById("_id").innerText;
    var value = parseInt(document.getElementById("number").value);
    $.post('/checkout', {itemID : x, qty : value}, function(result){
        
    });

}

function decreaseValue() {
    console.log("WORK");
    var value = parseInt(document.getElementById("number").value);
    if (value > 0 )
        value--;

    document.getElementById('number').value = value;

    var stocks = parseInt(($('#stocks').text()).split(" ")[0]);
    if (value <= 0 ||  stocks <= 0)
        $('.btn.btn-warning.add_to_cart.mt-3').attr('disabled',true); 

    else
        $('.btn.btn-warning.add_to_cart.mt-3').attr('disabled',false);
}

function increaseValue() {
    var value = parseInt(document.getElementById("number").value);
    value++;
    document.getElementById('number').value = value;
    var stocks = parseInt(($('#stocks').text()).split(" ")[0]);
    if (value <= 0 ||  stocks <= 0)
        $('.btn.btn-warning.add_to_cart.mt-3').attr('disabled',true); 

    else
        $('.btn.btn-warning.add_to_cart.mt-3').attr('disabled',false);
}

