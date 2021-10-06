const fs = require('fs');
const path = require('path');
const authRouter = require('express').Router();
const { SESS } = require('../config');
const sessionHelper = require('../helpers/sessionHelper');
const { isAdmin, redirectLogin } = require('../helpers/authHelper');
const { jsonReader } = require('../helpers/jsonHelper');

module.exports = (app, passport) => {
    app.use('/auth', authRouter);
    // maybe get the get login  as well depends
    authRouter.get('/login', async (req, res, next) => {
        try {
            console.log(req.user)
            console.log('SUPER HELLO!! LOGIN');
            res.render('login', { user: req.user });
        } catch (error) {
            next(err);
        }
    });

    // get this in the docs
    authRouter.post('/login', passport.authenticate('local', { 
        failureRedirect: '/auth/login', // Might remove redirect as well cuz I will be working with React.
        failureFlash: true, // might remove as I get the JSON/orSEND on the client I can put that in my HTML with React!
        failWithError: true // might remove as I get the JSON/orSEND on the client I can put that in my HTML with React!
    }), async (req, res, next) => {
        try {
            await fs.readFile(path.join(__dirname, '../swagger.json'), "utf8", (err, str) => {
                if (err) {
                    throw err;
                }
                const swagger = JSON.parse(str);
                console.log("string: ", swagger);
            
                if (swagger) {
                    swagger.paths['/users/{userId}'].get.parameters[0].schema.enum = [req.user.id];
                    swagger.paths['/users/{userId}'].put.parameters[0].schema.enum = [req.user.id];
                    swagger.paths['/users/{userId}'].delete.parameters[0].schema.enum = [req.user.id];
                }
            
                fs.writeFile(path.join(__dirname, '../swagger.json'), JSON.stringify(swagger, null, 4), (err) => {
                    if (err) throw err;
                });
            });

            res.redirect('/docs');
        } catch (err) {
            next(err) // NEVER gets called maybe remove
        }
    });

    authRouter.get('/home', (req, res, next) => {     
        try {
            res.render('home', { user: req.user })
            // res.redirect('/docs');            
        } catch (err) {
            next(err) // NEVER gets called maybe remove
        }
        // res.render('home', { user: req.user })
    });

    authRouter.get('/profile', redirectLogin, async (req, res, next) => {
        try {
            console.log('req.user PROFILE')
            console.log(req.user)
            console.log('req.user')



            res.render('profile', { user: req.user })
        } catch (err) {
            next(err)
        }
    })

    authRouter.get('/admin', isAdmin, (req, res, next) => {
        try {
            console.log('req.user ADMIN')
            console.log(req.user)
            console.log('req.user')

            res.render('admin', { user: req.user })
        } catch (err) {
            next(err)
        }
    })
    // get this in the docs
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