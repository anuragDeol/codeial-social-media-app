let create=function(o){let n=$(`#post-${o}-comment-form`);n.off().submit(function(e){e.preventDefault(),$.ajax({type:"post",url:"/comments/create",data:n.serialize(),success:function(e){var t=newCommentDom(e.data.comment);$(`#post-${o} .post-comments-list>ul`).append(t),deleteComment($(" .delete-comment-button",t)),new ToggleLike($(" .toggle-like-button",t)),n[0].reset(),showNotification(e)},error:function(e){console.log(e.responseText)}})})},newCommentDom=function(e){return $(`<li id="comment-${e._id}">
                <p class="font-family-bahnschrift">
                    ${e.content}
                    <small>
                        <a class="delete-comment-button" href="/comments/destroy/${e._id}"><i class="fa-solid fa-ban comment-delete-icon delete-icon"></i></a>
                    </small>
                    <br>
                    <small class="font-family-system-ui font-size-zero-point-7-rem">
                        ${e.user.name}
                    </small>
                    <br>
                    <small class="font-size-zero-point-7-rem font-family-sans-serif">
                        <a class="toggle-like-button" data-likes="${e.likes.length}" href="/likes/toggle/?id=${e._id}&type=Comment"> ${e.likes.length} Likes </a>
                    </small>
                </p>
            </li>`)},deleteComment=function(t){$(t).click(function(e){e.preventDefault(),$.ajax({type:"get",url:$(t).prop("href"),success:function(e){$("#comment-"+e.data.comment_id).remove(),showNotification(e)},error:function(e){console.log(e.responseText)}})})},showNotification=function(e){new Noty({theme:"semanticui",text:""+e.message,type:"success",layout:"topRight",timeout:1500}).show()};