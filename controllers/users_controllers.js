const User = require('../models/user');

module.exports.profile = function(req, res){
    // render profile page only when user is signed in
    if(req.cookies.user_id){
        User.findOne({_id: req.cookies.user_id}, function(err, user){
            if(err){console.log('error in finding user in db'); return}
            
            if(user){
                return res.render('user_profile', {
                    title: 'User Profile',
                    userInfo: user
                });
            }
            return res.redirect('/users/sign-in');
        });
    }else{
        // otherwise send user back to sign in page
        return res.redirect('/users/sign-in');
    }
}

// render the sign up page
module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
}

// render the sign in page
module.exports.signIn = function(req, res){
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
        /* steps to sign up the user and storing data in db */
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
    /* steps to authenticate */
    // find the user
    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing in'); return}
        
        // handle - user found
        if(user){
            // handle - if the passwords don't match
            if(user.password!=req.body.password){
                return res.redirect('back');
            }

            // handle - session creation
            res.cookie('user_id', user.id);
            return res.redirect('/users/profile');
        }
        // handle user not found
        else{
            return res.redirect('back');
        }

    });

}

// sign-out and delete session for the user
module.exports.deleteSession = function(req, res){
    /* steps to sign out and delete user session */
    // we just need to delete 'userId' which is kept in the cookie
    res.clearCookie('user_id');
    return res.redirect('/users/sign-in');

}