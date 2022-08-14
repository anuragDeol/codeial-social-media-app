const Comment = require('../models/comment');
const Post = require('../models/post');
// const { post } = require('../routes');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

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

            // popoulate the 
            try{
                comment = await comment.populate('user', 'name email');
                // commentsMailer.newComment(comment);
                let job = queue.create('emails', comment).save(function(err){
                    if(err){
                        console.log('error in sending to the queue', err);
                        return;
                    }

                    // console.log('job enqueued: ', job.id);
                });
            }catch(err){
                console.log('unable to populate the comment ', err);
            }

            if(req.xhr){
                // return some JSON
                // req.flash('success', 'Comment added successfully');
                // req.flash('success', 'Comment posted!');
                comment = await comment.populate('user', 'name');
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Success! Comment published"
                });
            }

            res.redirect('/');
        }
    }catch(err){
        req.flash('error', `${err}: unexpected error occured while commenting`);
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

            // req.flash('success', 'Comment deleted');
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Success! Comment Deleted"
                });
            }


            return res.redirect('back');
        }else{
            req.flash('error', 'You are not authorized to delete this comment');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', `${err} error while deleting the comment`);
        return;
    }
}