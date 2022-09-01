const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();

module.exports = (app) => {

    // Initialize passport
    app.use(passport.initialize());  
    app.use(passport.session());

    // Set method to serialize data to store in cookie
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    // Set method to deserialize data stored in cookie and attach to req.user
    passport.deserializeUser(async (id, done) => {
        const user = await AuthServiceInstance.loginId({id});
        done(null, user);
    })

    // Configure local strategy to be use for local login
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
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