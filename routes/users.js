const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users_controllers');

router.get('/profile', usersController.profile);
router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);


router.post('/create', usersController.create);
router.post('/create-session', usersController.createSession);

router.get('/delete-session', usersController.deleteSession);


module.exports = router;