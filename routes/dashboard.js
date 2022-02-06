const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');

router.get('/', indexController.dashboard);

router.get('/verify-member', userController.verify_member_get);

router.post('/verify-member', userController.verify_member_post);

router.get('/verify-admin', userController.verify_admin_get);

router.post('/verify-admin', userController.verify_admin_post);

module.exports = router;
