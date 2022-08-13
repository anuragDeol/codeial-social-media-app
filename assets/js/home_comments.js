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
                let newComment = newCommentDom(postId, data.data.comment);
                $(`#post-${postId} .post-comments-list>ul`).append(newComment);
                
                newCommentForm[0].reset();

                showNotification(data);

                deletePost($(' .delete-comment-button', newComment));
            }, error: function(error){
                console.log(error.responseText);
            }
        });
    });
}


let newCommentDom = function(postId, comment){
    return $(`<li id="post-${postId}-comment-${comment._id}">
        <p>
            <small>
                <a class="delete-comment-button" href="/comments/destroy/${comment._id}"><i class="fa-solid fa-ban"></i></a>
            </small>
            ${comment.content}
            <br>
            <small>
                ${comment.user.name}
            </small>
        </p>
    </li>`);
}


let deletePost  = function(deleteLink){
    $(deleteLink).click(function(e){
        e.preventDefault();

        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),    // syntax to get value of 'href' that is there in <a> tag
            success: function(data){
                // post deleted from db - now deleting post from DOM
                $(`#post-${data.data.post_id}`).remove();
                $(`#post-${postId}-comment-${data.data.comment_id}`);

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


// // Let's implement this via classes

// // this class would be initialized for every post on the page
// // 1. When the page loads
// // 2. Creation of every post dynamically via AJAX

// class PostComments{
//     // constructor is used to initialize the instance of the class whenever a new instance is created
//     constructor(postId){
//         this.postId = postId;
//         this.postContainer = $(`#post-${postId}`);
//         this.newCommentForm = $(`#post-${postId}-comments-form`);

//         console.log(postId);
//         this.createComment(postId);

//         let self = this;
//         // call for all the existing comments
//         $(' .delete-comment-button', this.postContainer).each(function(){
//             self.deleteComment($(this));
//         });
//     }


//     createComment(postId){
//         let pSelf = this;
//         this.newCommentForm.submit(function(e){
//             e.preventDefault();
//             let self = this;

//             $.ajax({
//                 type: 'post',
//                 url: '/comments/create',
//                 data: $(self).serialize(),
//                 success: function(data){
//                     let newComment = pSelf.newCommentDom(data.data.comment);
//                     $(`#post-comments-${postId}`).prepend(newComment);
//                     pSelf.deleteComment($(' .delete-comment-button', newComment));

//                     new Noty({
//                         theme: 'relax',
//                         text: "Comment published!",
//                         type: 'success',
//                         layout: 'topRight',
//                         timeout: 1500
                        
//                     }).show();

//                 }, error: function(error){
//                     console.log(error.responseText);
//                 }
//             });


//         });
//     }


//     newCommentDom(comment){
//         // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
//         return $(`<li id="comment-${ comment._id }">
//                         <p>
                            
//                             <small>
//                                 <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
//                             </small>
                            
//                             ${comment.content}
//                             <br>
//                             <small>
//                                 ${comment.user.name}
//                             </small>
//                         </p>    

//                 </li>`);
//     }


//     deleteComment(deleteLink){
//         $(deleteLink).click(function(e){
//             e.preventDefault();

//             $.ajax({
//                 type: 'get',
//                 url: $(deleteLink).prop('href'),
//                 success: function(data){
//                     $(`#comment-${data.data.comment_id}`).remove();

//                     new Noty({
//                         theme: 'relax',
//                         text: "Comment Deleted",
//                         type: 'success',
//                         layout: 'topRight',
//                         timeout: 1500
                        
//                     }).show();
//                 },error: function(error){
//                     console.log(error.responseText);
//                 }
//             });

//         });
//     }
// }





// xxxxxxxxxxxxxxxx

// this js file gets the data from the form (when user submits a comment)
// {
//     let createComment = function(){
//         let commentButton = $('#posts-list-container #submit-btn');
//         console.log(commentButton[0]);
//         console.log(commentButton[0].form);

//         commentButton[0].form.submit(function(e) {
//             e.preventDefault();
//         });
//     }

//     createComment();
// }




