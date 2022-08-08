const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req, res){
    try{
        // our request looks like -> likes/toggle/?id=randomstringhere&type=Post
        let likeable;   // on what did we like - Post or Comment - (id of which) will be stored in likeable
        let deleted = false;    // like or unlike - i.e. if the user is liking for the first time, create a new 'like' document, else delete it
        
        // 1. find out what the user has liked
        if(req.query.type == 'Post'){
            // post is liked
            likeable = await Post.findById('req.query.id').populate('likes');
        }else{
            // comment is liked
            likeable = await Comment.findById('req.query.id').populate('likes');
        }

        // 2. check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });


        // 3. if a like already exist then delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted = true;
        }else{
            // 4. else make a new like
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.json(200, {
            message: "Request Successful",
            data: {
                deleted: deleted
            }
        });

    }catch(err){
        // send back error msg as JSON object - AJAX request
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}