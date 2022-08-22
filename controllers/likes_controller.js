const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req, res){
    try{
        // console.log(req.query.id);
        // console.log(req.query.type);

        // our request looks like -> likes/toggle/?id=post._id&type=Post
        let likeableObject;   // on what did we like - Post or Comment - (the document of which) will be stored in likeableObject
        let deleted = false;    // like or unlike - i.e. if the user is liking for the first time, create a new 'like' document, else delete it
        
        // 1. find out what the user has liked
        if(req.query.type == 'Post'){
            // post is liked
            likeableObject = await Post.findById(req.query.id).populate('likes');
        }else{
            // comment is liked
            likeableObject = await Comment.findById(req.query.id).populate('likes');
        }

        // 2. check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });


        // 3. if a like already exist then delete it
        if(existingLike){
            //3a. if like object already exists, then first delete it from the post/comment to which it is referred to
            likeableObject.likes.pull(existingLike._id);
            likeableObject.save();

            //3b. then delete that like object/document from the 'Like' model
            existingLike.remove();
            deleted = true;

            console.log('** Unliked **');
        }else{
            // 4. else make a new like
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });


            likeableObject.likes.push(newLike._id);
            likeableObject.save();

            console.log('** Liked **');
        }

        // // deprecated syntax
        // return res.json(200, {
        //     message: "Request Successful",
        //     data: {
        //         deleted: deleted
        //     }
        // });

        // newer syntax of above deprecated syntax
        return res.status(200).json({
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

