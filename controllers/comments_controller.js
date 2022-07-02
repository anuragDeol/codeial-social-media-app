const Comment = require('../models/comment');
const Post = require('../models/post');


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