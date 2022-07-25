module.exports.index = function(req, res){
    return res.json(200, {
        message: "Success! List of posts from version V2",
        posts: []
    });
}