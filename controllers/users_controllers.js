const User = require('../models/user');

module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: 'User Profile'
    });
}

// render the sign up page
module.exports.signUp = function(req, res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
}

// render the sign in page
module.exports.signIn = function(req, res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
}

// get the sign up data
module.exports.create = function(req, res){
    // check whether pass and confirm pass are same or not
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    // if pass and confirm pass matches, then we check..
    // finding the user id
    User.findOne({email: req.body.email}, function(err, user){      // 'user' here is the document which is stored in our db, if it already exists, we get that document, else user is null
        if(err){console.log('error in finding user in signing up'); return}
        // console.log(`user: ${user}`);
        
        // if user id does not already exist, we create it in our db
        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            // else we do not create it
            return res.redirect('back');
        }
    });
}

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    // user is signed in - we just need to redirect
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    // built in function in passport js to logout user
    req.logout(function(err){
        if(err){
            return next(err);
        }
    });
    return res.redirect('/');
}