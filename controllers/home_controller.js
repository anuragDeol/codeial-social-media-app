const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){

    try{
        // populate the user of each post
        let posts = await Post.find({})
        .sort('-createdAt')    // sorts the post from nearest created to farthest created in time
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
            // below commented lines are causing error
            // ,
            // populate: {
            //     path: 'likes'
            // }
        }).populate('likes');

        let users = await User.find({});

        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });
    }catch(err){
        console.log(`Error: ${err}`);
        return;
    }
    
}

