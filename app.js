require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/user');

const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');
const bulletinRouter = require('./routes/bulletin');

const app = express();

// mongodb setup
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

// passportjs setup
const passport = require('passport');
const LocalStrategy = require('passport-local');
const strategy = new LocalStrategy(function verify(email, password, cb) {
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return cb(err);
    }
    if (!user) {
      cb(null, false, { message: 'Incorrect email or password.' });
    }
    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        return cb(null, user);
      } else {
        return cb(null, false, { message: 'Incorrect email or password.' });
      }
    });
    return cb(null, user);
  });
});
passport.use(strategy);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (user, cb) {
  User.findById(id, function (err, user) {
    cb(null, user);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/bulletin', bulletinRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
