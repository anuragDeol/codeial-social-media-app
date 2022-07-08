const Comment = require('../models/comment');
const Post = require('../models/post');
const { post } = require('../routes');


module.exports.create = async function(req, res){
    try{
        // before creating comment, check if the post on which we want to comment, exists or not (anyone could have messed with the 'id' of our post via developer tools)
        let post =  await Post.findById(req.body.post);
        if(post){
            // creating 'comment' document and adding into 'Comment' model alongwith, adding post 'id' to the comment
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            });

            // adding comment id to the post
            post.comments.push(comment);    // mongodb finds the id of the 'comment' document which is taajaa taajaa created and pushes in the array
            post.save();    // to save comment id in the database

            res.redirect('/');
        }
    }catch(err){
        console.log(`${err}: unexpected error occured while commenting`);
        return;
    }
}

module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);
        let postId = comment.post;   // before deleting comment, we need to fetch the id of the post to which this comment belongs to so that we can delete this comment from that post
        let post = await Post.findById(postId);

        if(comment.user == req.user.id || req.user.id == post.user){
            comment.remove();

            await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.log(`${err} error while deleting the comment`);
        return;
    }
}