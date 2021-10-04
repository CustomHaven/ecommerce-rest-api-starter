const authRouter = require('express').Router();
const { SESS } = require('../config');
const sessionHelper = require('../helpers/sessionHelper');

module.exports = (app, passport) => {
    app.use('/auth', authRouter);

    const redirectLogin = (req, res, next) => {
        if (!req.session.passport) {
            res.redirect('/auth/login')
        } else {
            next();
        }
    }
      
    authRouter.get('/login', sessionHelper, (req, res) => {
        // console.log(sessionHelper())
        console.log('SUPER HELLO!!')
        res.render('login', { user: req.user })
    });

    authRouter.post('/login', passport.authenticate('local', { 
        failureRedirect: '/auth/login',
        failureFlash: true,
        failWithError: true
    }), async (req, res) => {
        try {
            res.redirect('/auth/home');
        } catch (error) {
            res.status(500).send('Something went wrong: ' + error) // NEVER gets called maybe remove
        }
    });

    authRouter.get('/home', (req, res) => {        
        res.render('home', { user: req.user })
    });

    authRouter.get('/profile', redirectLogin, (req, res) => {
        res.render('profile', { user: req.user })
    })

    authRouter.get('/logout', async (req, res) => {// reason we are using get is i cant be asked to set up post form on
        console.log('is this called?! logout logout logout') // the front end so quick hypertag is quick
        req.session.destroy(err => {
          if (err) {
            return res.redirect('/auth/home')
          }
          res.clearCookie(SESS.NAME)
          res.redirect('/docs')
        })
    });
}