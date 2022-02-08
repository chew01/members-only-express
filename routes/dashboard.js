const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const {
  allowIfLoggedIn,
  allowIfMember,
  denyIfMember,
  denyIfAdmin,
} = require('./auth');

router.get('/', allowIfLoggedIn, indexController.dashboard);

router.get(
  '/verify-member',
  allowIfLoggedIn,
  denyIfMember,
  userController.verify_member_get
);

router.post(
  '/verify-member',
  allowIfLoggedIn,
  denyIfMember,
  userController.verify_member_post
);

router.get(
  '/verify-admin',
  allowIfMember,
  denyIfAdmin,
  userController.verify_admin_get
);

router.post(
  '/verify-admin',
  allowIfMember,
  denyIfAdmin,
  userController.verify_admin_post
);

router.get('/log-out', userController.log_out);

module.exports = router;
