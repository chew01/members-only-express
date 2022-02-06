const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');

router.get('/', indexController.index);

router.get('/sign-up', userController.signup_get);

router.post('/sign-up', userController.signup_post);

router.get('/log-in', userController.login_get);

router.post('/log-in', userController.login_post);

module.exports = router;
