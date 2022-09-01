const router = require('express').Router();
const { SESS } = require('../../config');

module.exports = (app, passport) => {
    app.use('/auth', router);
    // maybe get the get login  as well depends
    router.get('/login', async (req, res, next) => {
        try {
            res.status(201).send(req.user);
        } catch (error) {
            next(error);
        }
    });

    // get this in the docs
    router.post('/login', passport.authenticate('local', {
        failureRedirect: '/auth/login', // Might remove redirect as well cuz I will be working with React.
        failureFlash: true, // might remove as I get the JSON/orSEND on the client I can put that in my HTML with React!
        failWithError: true // might remove as I get the JSON/orSEND on the client I can put that in my HTML with React!
    }), async (req, res, next) => {
        try {

            res.redirect("/auth/home");
            // res.send('DONE');
        } catch (err) {
            next(err);
        }
    });

    router.get('/home', (req, res, next) => {     
        try {
            
            res.status(200).send(req.sessionID);
            // res.redirect('/docs');            
        } catch (err) {
            next(err);
        }
    });


    // get this in the docs
    router.get('/logout', async (req, res, next) => {
        // the front end so quick hypertag is quick
        try {
            req.session.destroy(err => {
                if (err) {
                    return res.redirect('/auth/home')
                }
                res.clearCookie(SESS.NAME);
                res.sendStatus(205);
            });
        } catch (error) {
            next(error);
        }
    });
}