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
        
        console.log(" we are making the OBJECT in serialize USer")
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
                console.log('helo passport')
                const user = await AuthServiceInstance.localLogin({ email: username, password });
                console.log('local')
                if (user.message === 'Incorrect email.') {
                    console.log(typeof user.message)
                    console.log(user.message)
                    console.log('local username')
                    return done(null, false, user.message)
                } else if (user.message === 'Incorrect password.') {
                    console.log(typeof user.message)
                    console.log(user.message)
                    console.log('local password')
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