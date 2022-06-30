const Comment = require('../models/comment');
const Post = require('../models/post');


module.exports.create = function(req, res){
    // before creating comment, check if the post on which we want to comment, exists or not
    Post.findById(req.body.post, function(err, post){
        if(post){
            // adding post id to the comment
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment){
                // HANDLE ERROR HERE...
                // adding comment id to the post
                post.comments.push(comment);    // mongodb finds the id and pushes in the array
                post.save();    // to save comment id in the database
            
                res.redirect('/');
            });
        }
    });
}