const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

module.exports.createSession = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});

        if(!user || user.password != req.body.password){
            return res.json(422, {
                message: "Invalid email or password"
            });
        }

        // authentication successful
        return res.json(200, {
            message: "Sign in successful, here is your token, please keep it safe",
            data: {
                username: user.name,
                token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '100000'})    // token creation
            }
        });
    }catch(err){
        console.log('*******', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }    
}