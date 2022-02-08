const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { allowIfLoggedIn, allowIfMember, allowIfAdmin } = require('./auth');

router.get('/', allowIfLoggedIn, postController.bulletin);

router.get(
  '/create',
  allowIfLoggedIn,
  allowIfMember,
  postController.post_create_get
);

router.post(
  '/create',
  allowIfLoggedIn,
  allowIfMember,
  postController.post_create_post
);

router.get('/:id', allowIfLoggedIn, allowIfMember, postController.post_details);

router.get(
  '/:id/delete',
  allowIfLoggedIn,
  allowIfAdmin,
  postController.post_delete_get
);

router.post(
  '/:id/delete',
  allowIfLoggedIn,
  allowIfAdmin,
  postController.post_delete_post
);

module.exports = router;
