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
                // the req goes to server, and the document is created and added to db and the JSON object is returned
                success: function(data){
                    // the JSON object returned from server is stored in 'data'
                    // console.log(data.data.post.content);
                    // console.log(data.message);
                    let newPost = newPostDom(data.data.post);
                    console.log(newPost);
                    $('#posts-list-container>ul').prepend(newPost);
                    
                    deletePost($(' .delete-post-button', newPost));     // newPost object has an <a> tag with 'delete-post-button' class in it

                    // enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));
                    
                    newPostForm[0].reset();

                    showNotification(data);
                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    
    // method to create a post in DOM
    // function to convert html into htmlText
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
            <p class="font-family-bahnschrift">
                <span class="font-size-1-point-2-rem">${post.content}</span>

                <small>
                    <a class="delete-post-button" href="/posts/destroy/${post._id}"><i class="fa-solid fa-ban post-delete-icon delete-icon"></i></a>
                </small>

                <br>
                
                <small class="font-family-system-ui font-size-zero-point-7-rem">
                    ${post.user.name}
                </small>

                <br>
                
                <small class="font-size-zero-point-7-rem font-family-sans-serif">
                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post"> ${post.likes.length} Likes </a>
                </small>
            </p>
            <br>

            <div class="post-comments">
                <form action="/comments/create" id="post-${post._id}-comment-form" method="POST">
                    <input type="text" name="content" placeholder="Comment on ${post.user.name}'s post" class="comment-input-form" required>
                    <!-- send 'id' of the post on which we want to comment -->
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Comment" onclick="create('${post._id}')" class="comment-btn">
                </form>

                <div class="post-comments-list">
                    <!-- <ul id="post-comments-${post._id}"> -->
                    <ul>

                    </ul>
                </div>
            </div>
        </li>`);
    }



    // method to delete a post from DOM
    let deletePost  = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),    // syntax to get value of 'href' that is there in <a> tag
                success: function(data){
                    // post deleted from db - now deleting post from DOM
                    $(`#post-${data.data.post_id}`).remove();

                    showNotification(data);

                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


    let showNotification = function(data){
        // console.log(data);
        new Noty({
            theme: 'semanticui',
            text: `${ data.message }`,
            type: 'success',
            layout: 'topRight',
            timeout: 1500,
        }).show();
    }

    
    createPost();
}


$('.toggle-like-button').onclick(function(e){
    e.preventDefault();
    console.log('working!!');
});
