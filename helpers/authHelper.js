const createError = require('http-errors');

// Main authorization middleware checks if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    if (req.user?.is_admin && req.isAuthenticated()) return next();
    throw createError(403, 'Only for an administrator');
  } catch (err) {
    next(err);
  }
};

// Authorization middleware placed inside a parameter with user_id checks if the user is an admin function will throw error if user is not.
// As well limits the logged in user to only see their own data and no body elses data
const limitIDAccess = (currentUser, loggedInUser) => {
  if (loggedInUser.is_admin === false) {
    if (currentUser?.is_admin !== loggedInUser?.is_admin) {
        throw createError(403, "Forbidden");
    } else if (currentUser.id !== loggedInUser.id) {
        throw createError(403, "Forbidden");
    }
  }
}

// Middleware checks if the user is Authenticated throws error if not.
const authenticationMiddleware = (req, res, next) => {
  try {
    if (req.isAuthenticated()) return next();
    throw createError(401, 'Not authorized');
    // res.redirect("/auth/login"); // when the frontend is setup redirect to from here res.redirect("/");
  } catch (error) {
    next(error)
  }
}

module.exports = {
  isAdmin,
  limitIDAccess,
  authenticationMiddleware
}