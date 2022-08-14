const Post = require('../models/post');
const Comment = require('../models/comment');
const { setFlash } = require('../config/middleware');

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        post = await post.populate('user');     // we will be able to fetch 'user.name'
        
        // check if the request is AJAX req
        // type of AJAX request is XMLHttpRequest(xhr)
        if(req.xhr){
            // return some JSON
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Success! Post published!"
            });
        }

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

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Success! Post Deleted"
                });
            }


            // req.flash('success', 'Post and associated comments deleted');
            
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