const createError = require('http-errors');

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user?.is_admin) {
      throw createError(403, 'Only for an admin user');
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

const redirectLogin = (req, res, next) => {
  try {
      if (!req.session.passport) {
          res.redirect('/auth/login')
      } else {
          next();
      }
  } catch (err) {
      next(err)
  }
}

module.exports = {
  isAdmin,
  redirectLogin
}