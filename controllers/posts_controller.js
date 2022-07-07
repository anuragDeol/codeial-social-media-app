const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function(req, res){
    Post.create({
        content: req.body.content,
        user: req.user._id     // 'user' is the document which has been authenticated by 'passport'
    }, function(err, post){
        if(err){console.log('error in creating a post'); return;}
    
        // console.log(`Post content: ${post.content} & the id of the user who posted it: ${post.user._id}`);
        return res.redirect('back');
    });
}

module.exports.destroy = function(req, res){
    // finding post in the db, that is to be deleted
    Post.findById(req.params.id, function(err, post){
        // checking if the user who's deleting the post, is the one who posted this post
        // .id means converting the object id into the string
        if(req.user.id == post.user){
            post.remove();

            Comment.deleteMany({post: req.params.id}, function(err){
                return res.redirect('back');
            });
        }
        else{
            return res.redirect('back');
        }
    });
}