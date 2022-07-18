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
                    // console.log(newPost);
                    $('#posts-list-container>ul').prepend(newPost);

                    showNotification(data);

                    deletePost($(' .delete-post-button', newPost));     // newPost object has an <a> tag with 'delete-post-button' class in it
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
            <p>
                <small>
                    <a class="delete-post-button" href="/posts/destroy/${ post._id }"><i class="fa-solid fa-ban"></i></a>
                </small>

                ${ post.content }
                <br>
                <small>
                    ${ post.user.name }
                </small>
            </p>

            <div class="post-comments">
                    <form action="/comments/create" method="POST">
                        <input type="text" name="content" placeholder="Comment here..." required>
                        <!-- send 'id' of the post on which we want to comment -->
                        <input type="hidden" name="post" value="${ post._id }">
                        <input type="submit" value="Comment">
                    </form>

                <div class="post-comments-list">
                    <ul id="post-comments-${ post._id } ">
                        
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
        console.log(data);
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