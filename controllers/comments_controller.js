const Comment = require('../models/comment');
const Post = require('../models/post');
const { post } = require('../routes');


module.exports.create = function(req, res){
    // before creating comment, check if the post on which we want to comment, exists or not (anyone could have messed with the 'id' of our post via developer tools)
    Post.findById(req.body.post, function(err, post){
        // error handling
        if(err){`${err}: the post does not exist`};

        if(post){
            // creating 'comment' document and adding into 'Comment' model alongwith, adding post 'id' to the comment
            Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            }, function(err, comment){
                // error handling
                if(err){ console.log(`${err}: unexpected error occured while commenting`); }

                // adding comment id to the post
                post.comments.push(comment);    // mongodb finds the id of the 'comment' document which is taajaa taajaa created and pushes in the array
                post.save();    // to save comment id in the database
            
                res.redirect('/');
            });
        }
    });
}

module.exports.destroy = function(req, res){
    Comment.findById(req.params.id, function(err, comment){
        let postId = comment.post;
        Post.findById(postId, function(err, post){
            if(comment.user == req.user.id || req.user.id == post.user){
                // before deleting comment, we need to fetch the id of the post to which this comment belongs to so that we can delete this comment from that post
                
                // let postId = comment.post;

                comment.remove();

                Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}}, function(err, post){
                    return res.redirect('back');
                });
            }
            else{
                return res.redirect('back');
            }
        });

    });
}