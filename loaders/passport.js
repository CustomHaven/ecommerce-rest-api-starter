const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();
const logger = require('../logger');

module.exports = (app) => {

    // Initialize passport
    app.use(passport.initialize());  
    app.use(passport.session());

    // Set method to serialize data to store in cookie
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    // Set method to deserialize data stored in cookie and attach to req.user
    passport.deserializeUser((id, done) => {
        AuthServiceInstance.loginId({id}).then((user) => {
            done(null, user);
        }).catch((error) => {
            console.log(`Error: ${error}`);
        });
    })

    // Configure local strategy to be use for local login
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                logger.info('we are in passport')
                logger.info(username)
                logger.info('we are in passport')
                logger.info(password)
                logger.info('we are in passport')
                const user = await AuthServiceInstance.localLogin({ email: username, password });

                if (user.message === 'Incorrect email.') {
                    return done(null, false, user.message)
                } else if (user.message === 'Incorrect password.') {
                    return done(null, false, user.message)
                } else {
                    done(null, user)
                }

            } catch (error) {
                done(error)
            }
        }
    ));

    return passport;
}