const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Post = require('../models/post');
const resetPassToken = require('../models/resetPassToken');
const passportResetMailer = require('../mailers/password_reset_mailer');
const { findById } = require('../models/user');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){

        if(err) { console.log(`Couldn't find the user: ${err}`); return;}

        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });
}

module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, {
    //         name: req.body.name,
    //         email: req.body.email
    //     }, function(err, user){
    //         req.flash('success', 'Your information is successfully updated !');
    //         return res.redirect('back');
    //     });
    // }else{
    //     req.flash('error', 'Unable to update your information');
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id){

        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){ console.log('*****Multer Error: ', err); }

                // console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){

                    // if(user.avatar){
                    //     // fs: filesystem
                    //     // it unlinks the already existing file, and links the new uploaded one
                    //     // But it may give error if there is no file present already - so this is not the best way to deal with this problem
                    //     fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    // }


                    // saving path of uploaded file into the avatar field in the new created 'user' document
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }

    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
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
    req.flash('success', 'Logged in successfully!');

    // user is signed in - we just need to redirect
    return res.redirect('/');
}

// sign out user
module.exports.destroySession = function(req, res){
    
    // built in function in passport js to logout user
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success', 'You have been logged out!');
        return res.redirect('/');
    });
}


// initiate forgot password by asking user's email
module.exports.forgotPassword = function(req, res){
    return res.render('forgot_pass', {
        title: "Enter the email."
    });
}

// send mail to the user - to reset password
module.exports.forgotPasswordUserVerification = async function(req, res){
    try{
        // 1. find user with email
        let user = await User.findOne({email: req.body.email});
        if(!user){ console.log('looks like the email you entered is incorrect'); return; }

        // 2. create fogot password token document
        let token = await resetPassToken.create({
            user: user
        });

        // 3. send the token to the user via mail (mailer nodejs)
        passportResetMailer.resetPass(token);

        // ** NOTY can be used here **
        return res.render('message', {
            title: "Message!"
        });

    }catch(err){
        console.log('couldnt change password', err);
        res.redirect('/');
    }

}

// user clicks the link shared via mail - ask user to enter new password
module.exports.newPassword = async function(req, res){
    try{
        let token = await resetPassToken.findOne({accessToken : req.params.token});

        // console.log("Line 181: token document found!!", token);
        if(token.isValid){
            return res.render('forgot_pass', {
                title: "Enter your new password.",
                token: token
            });
        }else{
            console.log("Looks like the link has expired. Generate another one by clicking on FORGOT PASSWORD");
        }
    }catch(err){
        console.log('You are not authorized to change password', err);
    }
    
    return res.redirect('/');
}

// update user's new password
module.exports.updatePassword = async function(req, res){
    try{
        let token = await resetPassToken.findOne({accessToken : req.params.token});
        // change user password
        if(req.body.password !== req.body.confirmPassword){
            console.log('Password and Confirm Password do not match. Please enter again');
            
            return res.render('forgot_pass', {
                title: "Enter new password",
                token: token
            });
        }else{
            // find the user
            let user = await User.findById(token.user);
            user.password = req.body.password;
            user.save();
            console.log("password changed successfully!");
        }
        token.isValid = false;  // user won't be able to change password with the same link again (link shared via mail)
        token.save();
    }catch(err){
        console.log('error in updating password', err);
    }
    return res.redirect('/');
}