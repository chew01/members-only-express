exports.allowIfLoggedIn = function (req, res, next) {
  if (req.user) {
    return next();
  } else {
    return res.redirect('/');
  }
};

exports.allowIfMember = function (req, res, next) {
  if (req.user.isMember) {
    return next();
  } else {
    return res.redirect('/');
  }
};

exports.allowIfAdmin = function (req, res, next) {
  if (req.user.isAdmin) {
    return next();
  } else {
    return res.redirect('/');
  }
};

exports.denyIfLoggedIn = function (req, res, next) {
  if (!req.user) {
    return next();
  } else {
    return res.redirect('/dashboard');
  }
};

exports.denyIfMember = function (req, res, next) {
  if (!req.user.isMember) {
    return next();
  } else {
    return res.redirect('/dashboard');
  }
};

exports.denyIfAdmin = function (req, res, next) {
  if (!req.user.isAdmin) {
    return next();
  } else {
    return res.redirect('/dashboard');
  }
};
