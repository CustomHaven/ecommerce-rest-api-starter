const cron = require('node-cron');
const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();

/*
"* * * * * *"
 | | | | | |
 | | | | | |
 | | | | | day of week
 | | | | month
 | | | day of month
 | | hour
 | minute
 second(optional)
 */

function formatDate(date) {
/* take care of the values:
  second: 0-59 same for javascript
  minute: 0-59 same for javascript
  hour: 0-23 same for javascript
  day of month: 1-31 same for javascript
  month: 1-12 (or names) is not the same for javascript 0-11
  day of week: 0-7 (or names, 0 or 7 are sunday) same for javascript
*/ // later getHours remove the + 1 as my computer is 1 hour before whatever is stored to my DB
  return `${date.getSeconds() + 2} ${date.getMinutes()} ${date.getHours() + 1} ${date.getDate()} ${date.getMonth() + 1} ${date.getDay()}`;
}


function sessDeleteJob(data) {
  const { time, id } = data;
  const job = cron.schedule(formatDate(time), () => {
    doSomething();
  });

  const doSomething = async () => {
    await AuthServiceInstance.deleteSess({id});
    // stop job
    job.stop();
  }
}

module.exports = sessDeleteJob;