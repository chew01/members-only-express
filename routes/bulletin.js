const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.bulletin);

router.get('/create', postController.post_create_get);

router.post('/create', postController.post_create_post);

router.get('/:id', postController.post_details);

router.get('/:id/delete', postController.post_delete_get);

router.post('/:id/delete', postController.post_delete_post);

module.exports = router;
