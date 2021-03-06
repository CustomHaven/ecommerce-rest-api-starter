const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();
const sessDeleteJob = require('./CronJobHelper');

// dont think i am using this sessionHelper prehaps do delete the file
const sessionHelper = async (req, res, next) => {
  try {
    const findSession = await AuthServiceInstance.sessID({ id: req.sessionID });
    if (findSession === null) {
      if (findSession.expire !== undefined) {
        const time = new Date(findSession.expire);
        const newObject = {
          time,
          id: findSession.sid
        };
        (async () => await sessDeleteJob(newObject))();
        next();
      }
    } else {
      // Error({ message: findSession.message })
      // res.redirect('/auth/home')
      next()
    }
  } catch (err) {
    next(err) // how do i make it call here with the error message?
  }
}


module.exports = sessionHelper;