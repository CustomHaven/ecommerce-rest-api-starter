const router = require('express').Router();
const UserService = require('../../services/UserService');
const UserServiceInstance = new UserService();
const bcrypt = require('bcryptjs');
const { isAdmin, limitIDAccess, authenticationMiddleware } = require('../../helpers/authHelper');
const createError = require('http-errors');

module.exports = (app) => {
    app.use('/v2/users', router);

    router.param('id', async (req, res, next) => {
        try {
            const user = await UserServiceInstance.findOneUser(req.params.id, 'users', 'id');
            
            limitIDAccess(user, req.user);
            req.userInfo = user;
            next();
        } catch (err) {
            next(err)
        }
    })

    router.get('/', isAdmin, async (req, res, next) => { // add isAdmin
        try {
            const response = await UserServiceInstance.allUsers('users');

            res.status(200).send(response);
        } catch(err) {
            next(err);
        }
    
    })

    router.post('/', async (req, res, next) => {
        try {
            const { email, password, first_name, last_name } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt)
            const data = {
                is_admin: false,
                first_name: first_name.toLowerCase(), 
                last_name: last_name.toLowerCase(), 
                email: email.toLowerCase(), 
                password: hash,
                google_id: null,
                facebook_id: null
            }
            const response = await UserServiceInstance.newUser(data, 'users')
            res.status(201).send(response);
        } catch(err) {
            next(err);
        }
    })


    router.get('/:id', authenticationMiddleware, async (req, res, next) => {
        try {
            if (req.userInfo === undefined) {
                throw createError(404, 'Not logged in')
            } else {
                const user = req.userInfo;
                if (user.id !== req.userInfo.id) {
                    throw createError(401, 'Refresh the page should work ;)')
                } else {
                    res.status(200).send(user);
                }
            }
        } catch(err) {
            next(err);
        }
    })

    router.put('/:id', authenticationMiddleware, async (req, res, next) => {
        try {
            if (req.userInfo === undefined) {
                throw createError(404, 'Not logged in')
            } else {
                const user = req.userInfo;
                if (user.id !== req.userInfo.id) {
                    throw createError(401, 'Refresh the page should work ;)')
                } else {
                    for (const key in req.body) {
                        if (req.body[key] === '' || req.body[key] === null || req.body[key] === undefined) {
                            delete req.body[key]
                        } else {
                            if (typeof req.body[key] === "string") {
                                req.body[key] = req.body[key]?.toLowerCase();
                            }
                        }
                    }
                    req.body.modified = 'NOW()';

                    const userUpdated = await UserServiceInstance.updateUser(user.id, req.body, 'users', 'id');
                    res.status(201).send(userUpdated);
                }
            }
        } catch(err) {
            next(err);
        }
    })
    
    router.delete('/:id', authenticationMiddleware, async (req, res, next) => {
        try {
            if (req.userInfo === undefined) {
                throw createError(404, 'Not logged in')
            } else {
                const user = req.userInfo;
                if (user.id !== req.userInfo.id) {
                    throw createError(401, 'Refresh the page should work ;)')
                } else {
                    const result = await UserServiceInstance.removeUser(user.id, 'users', 'id');

                    res.status(204).send("User was deleted");
                }
            }
        } catch(err) {
            next(err);
        }
    });

    router.post('/newadmin', isAdmin, async (req, res, next) => {
        try {
            const { email, password, first_name, last_name } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            const data = {
                email: email.toLowerCase(), 
                password: hash, 
                first_name: first_name.toLowerCase(), 
                last_name: last_name.toLowerCase(), 
                is_admin: true,
                google_id: null,
                facebook_id: null
            }

            const response = await UserServiceInstance.newUser(data, 'users');
            res.status(201).send(response);
        } catch(err) {
            next(err);
        }
    });
}