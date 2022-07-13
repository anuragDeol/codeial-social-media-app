// this js file gets the data from the form (when user submits a post)
{
    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            // e - event
            e.preventDefault();

            // manually submit the form (Post) using AJAX
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),  // converts the form data into JSON
                success: function(data){
                    console.log(data);
                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    
    // method to create a post in DOM


    createPost();
}