const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const { denyIfMember, denyIfLoggedIn } = require('../routes/auth');

router.get('/', denyIfLoggedIn, indexController.index);

router.get('/sign-up', denyIfLoggedIn, userController.signup_get);

router.post('/sign-up', denyIfLoggedIn, userController.signup_post);

router.get('/log-in', denyIfLoggedIn, userController.login_get);

router.post('/log-in', denyIfLoggedIn, userController.login_post);

module.exports = router;
