let create = function(postId) {
    // console.log(postId);

    // let postContainer = $(`#post-${postId}`);
    let newCommentForm = $(`#post-${postId}-comment-form`);

    newCommentForm.off().submit(function(e){    // *here the issue was that this event was being called 'i' times on ith consecutive click - solution found on stackoverflow - using '.off()' cancels all previous eventhandlers before calling the next one
        e.preventDefault();
        // console.log('clicked');

        // since we prevented the form from submitting - we manually need to do so asynchronously using AJAX
        $.ajax({
            type: 'post',
            url: '/comments/create',
            data: newCommentForm.serialize(),

            // res received in JSON format
            success: function(data){
                // console.log(data.data.comment._id);
                // alert('request sent');
                let newComment = newCommentDom(data.data.comment);
                $(`#post-${postId} .post-comments-list>ul`).append(newComment);
                
                deleteComment($(' .delete-comment-button', newComment));


                // enable the functionality of the toggle like button on the new post
                new ToggleLike($(' .toggle-like-button', newComment));
                
                newCommentForm[0].reset();

                showNotification(data);
            }, error: function(error){
                console.log(error.responseText);
            }
        });
    });
}


let newCommentDom = function(comment){
    return $(`<li id="comment-${comment._id}">
        <p>
            <small>
                <a class="delete-comment-button" href="/comments/destroy/${comment._id}"><i class="fa-solid fa-ban"></i></a>
            </small>
            ${comment.content}
            <br>
            <small>
                ${comment.user.name}
            </small>

            <small>
                <a class="toggle-like-button" data-likes=0 href="/likes/toggle/?id=${comment._id}&type=Comment"> 0 Likes </a>
            </small>
        </p>
    </li>`);
}


let deleteComment  = function(deleteLink){
    $(deleteLink).click(function(e){
        e.preventDefault();

        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),    // syntax to get value of 'href' that is there in <a> tag
            success: function(data){
                // 'data' contains the deleted comment document that has been deleted from the db and returned as a JSON response from the controller's action
                // comment deleted from db - now deleting comment from DOM
                $(`#comment-${data.data.comment_id}`).remove();

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
        text: `${data.message}`,
        type: 'success',
        layout: 'topRight',
        timeout: 1500,
    }).show();
}


