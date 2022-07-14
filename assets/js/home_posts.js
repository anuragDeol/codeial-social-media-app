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
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
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
                            <a class="delete-post-button" href="/posts/destroy/${ post.id }"><i class="fa-solid fa-ban"></i></a>
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

    createPost();
}