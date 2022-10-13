{let e=function(){let o=$("#new-post-form");o.submit(function(e){e.preventDefault(),$.ajax({type:"post",url:"/posts/create",data:o.serialize(),success:function(e){var t=s(e.data.post);console.log(t),$("#posts-list-container>ul").prepend(t),n($(" .delete-post-button",t)),new ToggleLike($(" .toggle-like-button",t)),o[0].reset(),i(e)},error:function(e){console.log(e.responseText)}})})},s=function(e){return $(`<li id="post-${e._id}">
            <p class="font-family-bahnschrift">
                <span class="font-size-1-point-2-rem">${e.content}</span>

                <small>
                    <a class="delete-post-button" href="/posts/destroy/${e._id}"><i class="fa-solid fa-ban post-delete-icon delete-icon"></i></a>
                </small>

                <br>
                
                <small class="font-family-system-ui font-size-zero-point-7-rem">
                    ${e.user.name}
                </small>

                <br>
                
                <small class="font-size-zero-point-7-rem font-family-sans-serif">
                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${e._id}&type=Post"> ${e.likes.length} Likes </a>
                </small>
            </p>
            <br>

            <div class="post-comments">
                <form action="/comments/create" id="post-${e._id}-comment-form" method="POST">
                    <input type="text" name="content" placeholder="Comment on ${e.user.name}'s post" class="comment-input-form" required>
                    <!-- send 'id' of the post on which we want to comment -->
                    <input type="hidden" name="post" value="${e._id}">
                    <input type="submit" value="Comment" onclick="create('${e._id}')" class="comment-btn">
                </form>

                <div class="post-comments-list">
                    <!-- <ul id="post-comments-${e._id}"> -->
                    <ul>

                    </ul>
                </div>
            </div>
        </li>`)},n=function(t){$(t).click(function(e){e.preventDefault(),$.ajax({type:"get",url:$(t).prop("href"),success:function(e){$("#post-"+e.data.post_id).remove(),i(e)},error:function(e){console.log(e.responseText)}})})},i=function(e){new Noty({theme:"semanticui",text:""+e.message,type:"success",layout:"topRight",timeout:1500}).show()};e()}$(".toggle-like-button").onclick(function(e){e.preventDefault(),console.log("working!!")});