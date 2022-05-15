const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('router loaded');

router.get('/', homeController.home);
router.use('/users', require('./users'));


module.exports = router;    // all  http requests (get,post, etc..) will be handled by this module