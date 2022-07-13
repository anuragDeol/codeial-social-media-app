const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        
        // check if the request is AJAX req
        // type of AJAX request is XMLHttpRequest(xhr)
        if(req.xhr){
            // return some JSON
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');
    }catch(err){
        req.flash('error', err);
        return;
    }
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findByIdAndDelete(req.params.id);

        if(post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({post: req.params.id});
            req.flash('success', 'Post and associated comments deleted');
            
            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}