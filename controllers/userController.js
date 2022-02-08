const { body, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../models/user');
const Code = require('../models/code');
const bcrypt = require('bcryptjs');

exports.log_out = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.login_get = (req, res) => {
  res.render('login', { error: req.session.messages });
};

exports.login_post = passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/log-in',
  failureMessage: true,
});

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
  res.render('verify_form', {
    type: 'Verify Membership',
    destination: '/dashboard/verify-member',
    rank: 'Verified Members',
  });
};

exports.verify_member_post = (req, res, next) => {
  Code.findOne({ type: 'member' }).exec((err, result) => {
    if (err) {
      return next(err);
    }
    bcrypt.compare(req.body.passcode, result.code, (err, isMatch) => {
      if (err) {
        return next(err);
      }
      if (isMatch) {
        // Password is correct
        User.findByIdAndUpdate(
          res.locals.currentUser._id,
          { isMember: true },
          (err, result) => {
            if (err) {
              next(err);
            }
            return res.redirect('/dashboard');
          }
        );
      } else {
        // Password is incorrect
        res.render('verify_form', {
          type: 'Verify Membership',
          destination: '/dashboard/verify-member',
          rank: 'Verified Members',
          error: 'Incorrect password.',
        });
      }
    });
  });
};

exports.verify_admin_get = (req, res) => {
  res.render('verify_form', {
    type: 'Verify Admin',
    destination: '/dashboard/verify-admin',
    rank: 'Administrators',
  });
};

exports.verify_admin_post = (req, res, next) => {
  Code.findOne({ type: 'admin' }).exec((err, result) => {
    if (err) {
      return next(err);
    }
    bcrypt.compare(req.body.passcode, result.code, (err, isMatch) => {
      if (err) {
        return next(err);
      }
      if (isMatch) {
        // Password is correct
        User.findByIdAndUpdate(
          res.locals.currentUser._id,
          { isAdmin: true },
          (err, result) => {
            if (err) {
              next(err);
            }
            return res.redirect('/dashboard');
          }
        );
      } else {
        // Password is incorrect
        res.render('verify_form', {
          type: 'Verify Admin',
          destination: '/dashboard/verify-admin',
          rank: 'Administrators',
          error: 'Incorrect password.',
        });
      }
    });
  });
};
