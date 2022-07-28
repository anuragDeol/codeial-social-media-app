const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controllers');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);  // we will only be able to access profile page if the user is signed in
router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);


router.post('/create', usersController.create);

// use passport as a middleware to authenticate
// it takes 3 arguements - 2nd arguement is middleware
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'} // if authentication fails, flow goes to the path specified in 'failureRedirect'
), usersController.createSession);  // else flow goes to 'createSession' action in 'usersController'

router.get('/sign-out', usersController.destroySession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate(
    'google',
    {failureRedirect: 'users/sign-in'}
), usersController.createSession);


module.exports = router;