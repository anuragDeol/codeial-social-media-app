const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');   // to generate random unique string - to set as default user password (when signing up)
const User = require('../models/user');
const env = require('./environment');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_callback_url
}, function(accessToken, refreshToken, profile, done){    // if accessToken expires, refreshToken refreshes it again
        // find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log('error in google strategy-passport', err);
                return;
            }
            // console.log(profile);

            if(user){
                // if found, set this user as req.user (i.e. sign in user)
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user (i.e. sign in user)
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){
                        console.log('error in google strategy-passport', err);
                        return;
                    }

                    return done(null, user);
                });
            }
        });
    }
));


module.exports = passport;