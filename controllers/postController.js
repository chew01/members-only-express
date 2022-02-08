const async = require('async');
const { body, validationResult } = require('express-validator');
const Post = require('../models/post');

exports.bulletin = (req, res) => {
  Post.find()
    .sort({ created_at: 1 })
    .exec((err, result) => {
      if (err) {
        return next(err);
      }
      res.render('bulletin', { user: res.locals.currentUser, posts: result });
    });
};

exports.post_details = (req, res, next) => {
  Post.findById(req.params.id)
    .populate('author')
    .exec((err, result) => {
      if (err) {
        return next(err);
      }
      res.render('post_details', {
        user: res.locals.currentUser,
        post: result,
      });
    });
};

exports.post_create_get = (req, res) => {
  res.render('post_form', {
    title: 'Create new post',
    user: res.locals.currentUser,
  });
};

exports.post_create_post = [
  body('title', 'Title is required').trim().isLength({ min: 1 }).escape(),
  body('content', 'Post content is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: res.locals.currentUser._id,
    });

    if (!errors.isEmpty) {
      res.render('post_form', {
        title: 'Create new post',
        user: res.locals.currentUser,
        post: post,
        errors: errors.array(),
      });
    } else {
      post.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect(post.url);
      });
    }
  },
];

exports.post_delete_get = (req, res) => {
  Post.findById(req.params.id)
    .populate('author')
    .exec((err, result) => {
      if (err) {
        return next(err);
      }
      res.render('post_delete', {
        user: res.locals.currentUser,
        post: result,
      });
    });
};

exports.post_delete_post = (req, res, next) => {
  Post.findById(req.params.id).exec((err, result) => {
    if (err) {
      return next(err);
    }
    if (result == null) {
      res.redirect('/bulletin');
    }
    Post.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/bulletin');
    });
  });
};
