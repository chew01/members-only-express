const { body, validationResult } = require('express-validator');
const User = require('../models/user');

exports.login_get = (req, res) => {
  res.send('WIP: Login get');
};

exports.login_post = (req, res) => {
  res.send('WIP: Login post');
};

exports.signup_get = (req, res) => {
  res.render('signup');
};

exports.signup_post = [
  body('first_name', 'First name is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('last_name', 'Last name is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be valid email address'),
  body(
    'password',
    'Password must be 8 characters long, and have at least 1 lowercase, 1 uppercase, 1 number and 1 symbol.'
  ).isStrongPassword(),
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      res.render('signup', { user: user, errors: errors.array() });
      return;
    } else {
      User.findOne({ email: req.body.email }).exec((err, result) => {
        if (err) {
          return next(err);
        }
        if (result) {
          res.render('signup', {
            user: user,
            errors: [{ msg: 'Email is already in use' }],
          });
          return;
        }
        user.save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect('/log-in');
          return;
        });
      });
    }
  },
];

exports.verify_member_get = (req, res) => {
  res.send('WIP: Verify Member Get');
};

exports.verify_member_post = (req, res) => {
  res.send('WIP: Verify Member Post');
};

exports.verify_admin_get = (req, res) => {
  res.send('WIP: Verify Admin Get');
};

exports.verify_admin_post = (req, res) => {
  res.send('WIP: Verify Admin Post');
};
