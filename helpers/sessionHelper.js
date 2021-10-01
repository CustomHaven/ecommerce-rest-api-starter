const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();
const sessDeleteJob = require('./CronJobHelper');

const sessionHelper = async (req, res, next) => {
  try {
    const findSession = await AuthServiceInstance.sessID({ id: req.sessionID });
    if (!findSession.message) {
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
      console.log(findSession.message)
      Error({ message: findSession.message })
      next()
    }
  } catch (error) {
    return error.message // how do i make it call here with the error message?
  }
}


module.exports = sessionHelper;