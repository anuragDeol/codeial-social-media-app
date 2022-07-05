const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentsController = require('../controllers/comments_controller');

router.post('/create', passport.checkAuthentication, commentsController.create);   // if user is not authenticated, this control won't be called
router.get('/destroy/:id', passport.checkAuthentication, commentsController.destroy);

module.exports = router;