const async = require('async');
const User = require('../models/user');
const Post = require('../models/post');

exports.index = (req, res) => {
  res.render('index');
};

exports.dashboard = (req, res, next) => {
  async.parallel(
    {
      users: (callback) => {
        User.countDocuments({}).exec(callback);
      },
      unverified: (callback) => {
        User.countDocuments({ isMember: false }).exec(callback);
      },
      member: (callback) => {
        User.countDocuments({ isMember: true, isAdmin: false }).exec(callback);
      },
      admin: (callback) => {
        User.countDocuments({ isAdmin: true }).exec(callback);
      },
      posts: (callback) => {
        Post.countDocuments({}).exec(callback);
      },
    },
    (err, result) => {
      if (err) {
        return next(err);
      }
      res.render('dashboard', { user: res.locals.currentUser, count: result });
    }
  );
};
