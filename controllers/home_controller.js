const Post = require('../models/post');
const User = require('../models/user');
// module.exports.home = function(req, res){
//     return res.end('<h1>Express is up for Codeial</h1>')
// }

module.exports.home = function(req, res){
    // console.log(req.cookies);
    // res.cookie("user_id", 252);
    // Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts: posts
    //     });
    // });

    // populate the user of each post
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts){

        if(err){
            console.log(`error: ${err}`);
            return;
        }

        User.find({}, function(err, users){
            return res.render('home', {
                title: "Codeial | Home",
                posts: posts,
                all_users: users
            });
        });
    })
}

