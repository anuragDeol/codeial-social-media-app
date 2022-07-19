// this js file gets the data from the form (when user submits a comment)
{
    let createComment = function(){
        let newCommentForm = $('#new-comment-form');
        newCommentForm.submit(function(e){
            e.preventDefault();     // DOUBT: why is this not working
            // console.log('pressed');

            // // manually submit the form (Comment) using AJAX
            // $.ajax({
            //     type: 'post',
            //     url: '/comments/create',
            //     data: newCommentForm.serialize(),  // converts the form data into JSON
            //     // the req goes to server, and the document is created and added to db and the JSON object is returned
            //     success: function(data){
            //         console.log(data);
            //     }, error: function(error){
            //         console.log(error.responseText);
            //     }
            // });
        });
    }

    createComment();
}