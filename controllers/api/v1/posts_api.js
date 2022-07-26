const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){

    // populate the user of each post
    let posts = await Post.find({})
        .sort('-createdAt')    // sorts the post from nearest created to farthest created in time
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });



    return res.json(200, {
        message: "List of posts",
        posts: posts
        // // if we do not want to send password, in such case we can only pass the fields we want
        // posts: {
        //     content: posts[0].content,
        //     user: posts[0].user.name
        // }
    });
}


module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
            post.remove();

            await Comment.deleteMany({post: req.params.id});
            return res.json(200, {
                message: "Post and associated comments deleted successfully!"
            });
    }catch(err){
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}