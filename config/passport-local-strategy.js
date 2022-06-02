const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// Authentication using passport
// tell passport to use this 'LocalStrategy'
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email, password, done){    // 'done' is a callback function which reports back to passport js
        // find a user and establish the identity
        User.findOne({email: email}, function(err, user){
            if(err){
                console.log('Error in finding user --> Passport');
                return done(err);
            }

            if(!user || user.password!=password){
                console.log('Invalid Username/Password');
                return done(null, false);   // null-no error; false-not authenticated
            }
            return done(null, user);    // null-no error; user-user authenticated
        });
    }
));

// serializing - taking id and setting it into cookie
// serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user, done){
    done(null, user.id);    // (null-no error, user.id-user's id is encrypted and stored in cookie)
});

// deserializing - when cookie is being sent back to server, and getting the user corresponding to that id
// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);    // (null-because no error is there, user-because user is found)
    });
});

// middleware to check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // middleware
    // if the user is signed in - then pass on the request to the next function(which is my controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

// once the user is signed in..
passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending it to the locals for the views
        res.locals.user = req.user;     // 'user' is now accessible in views
    }
    next();
}

module.exports = passport;