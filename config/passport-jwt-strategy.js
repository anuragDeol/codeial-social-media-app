const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),   // header has list of keys(Authorization is one) > Authorization has list of keys(bearer is one) > bearer has the the 'jwt' token
    secretOrKey: 'codeial'      // 'codeial' is our encryption and decryption key
}

passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){  // 'jwtPayLoad' contains the payload (which is inside the jwt token), and it contains all the user info

    User.findById(jwtPayLoad._id, function(err, user){
        if(err){ console.log('Error in finding user from JWT '); return; }
        
        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }
    });

}));

module.exports = passport;