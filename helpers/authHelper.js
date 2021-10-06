const createError = require('http-errors');

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user?.is_admin) {
      // redirect to non admin page and maybe send not authorized 401 as well with message: not authorized
      // res.redirect('/auth/profile');
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
      // console.log(next(1))
      console.log(req.session.passport)
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