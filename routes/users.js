const usersRouter = require('express').Router();
const UserService = require('../services/UserService');
const UserServiceInstance = new UserService();
const bcrypt = require('bcryptjs');
const { isAdmin } = require('../helpers/authHelper');
const createError = require('http-errors');

module.exports = (app) => {
    app.use('/users', usersRouter);

    usersRouter.param('userId', async (req, res, next, userId) => {
        try {
            const user = await UserServiceInstance.findOneUser(Number(userId), 'users', 'id');
            req.userInfo = user;
            next();
        } catch (err) {
            next(err)
        }
    })

    usersRouter.get('/', isAdmin, async (req, res, next) => {
        try {
            const response = await UserServiceInstance.allUsers('users');

            res.status(200).send(response);
        } catch(err) {
            next(err);
        }
    
    })

    usersRouter.post('/', async (req, res, next) => {
        try {
            const { email, password, first_name, last_name } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt)
            const data = {
                email: email.toLowerCase(), 
                password: hash,
                first_name, 
                last_name, 
                is_admin: false,
                google_id: null,
                facebook_id: null
            }
            const response = await UserServiceInstance.newUser(data, 'users')
            res.status(201).send(response);
        } catch(err) {
            next(err);
        }
    })

    usersRouter.get('/:userId', async (req, res, next) => {
        try {
            if (req.user === undefined) {
                throw createError(404, 'Not logged in')
            } else {
                const user = req.userInfo;
                if (user.id !== req.user.id) {
                    throw createError(401, 'Refresh the page should work ;)')
                } else {
                    res.status(200).send(user);
                }
            }
        } catch(err) {
           next(err);
        }
    })

    usersRouter.put('/:userId', async (req, res, next) => {
        try {
            if (req.user === undefined) {
                throw createError(404, 'Not logged in')
            } else {
                const user = req.userInfo;
                if (user.id !== req.user.id) {
                    throw createError(401, 'Refresh the page should work ;)')
                } else {
                    for (const key in req.body) {
                        if (req.body[key] === '' || req.body[key] === null || req.body[key] === undefined) {
                            delete req.body[key]
                        }
                    }
                    const userUpdated = await UserServiceInstance.updateUser(user.id, req.body, 'users', 'id');
                    res.status(201).send(userUpdated);
                }
            }
        } catch(err) {
            next(err);
        }
    })
    
    usersRouter.delete('/:userId', async (req, res, next) => {
        try {
            if (req.user === undefined) {
                throw createError(404, 'Not logged in')
            } else {
                const user = req.userInfo;
                if (user.id !== req.user.id) {
                    throw createError(401, 'Refresh the page should work ;)')
                } else {
                    await UserServiceInstance.removeUser(user.id, 'users', 'id');
                    res.status(204).send("User was deleted");
                }
            }
        } catch(err) {
            next(err);
        }
    })

    usersRouter.post('/newadmin', isAdmin, async (req, res, next) => {
        try {
            const { email, password, first_name, last_name } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt)
            const data = {
                email, 
                password: hash, 
                first_name, 
                last_name, 
                is_admin: true,
                google_id: null,
                facebook_id: null
            }

            const response = await UserServiceInstance.newUser(data, 'users');
            res.status(201).send(response);
        } catch(err) {
            next(err);
        }
    })
}