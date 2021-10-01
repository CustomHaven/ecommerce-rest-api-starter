const usersRouter = require('express').Router();
const UserService = require('../services/UserService');
const UserServiceInstance = new UserService();
const bcrypt = require('bcryptjs');

// change this to super admins instead!
module.exports = (app) => {
    app.use('/users', usersRouter);

    const isAdmin = (req, res, next) => {
        // const findUser = await UserServiceInstance. // session set it up now!
    }

    usersRouter.get('/', async (req, res, next) => {
        try {
            const response = await UserServiceInstance.allUsers('users');

            res.status(200).send(response);
        } catch(err) {
            res.status(404).send(err)
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
            res.status(500).send(err)
        }
    })

    usersRouter.get('/:userId', async (req, res, next) => {
        try {
           const { userId } = req.params;
           const customer = await UserServiceInstance.findOneUser(Number(userId), 'users', 'uid');
           res.status(200).send(customer);
        } catch(err) {
           res.status(404).send(err)
        }
    })

    usersRouter.put('/:userId', async (req, res, next) => {
        try {
           const id = Number(req.params.userId)
           const customerUpdated = await UserServiceInstance.updateUser(id, req.body, 'users', 'uid');
           res.status(201).send(customerUpdated);
        } catch(err) {
            res.status(404).send(err)
        }
    })
    
    usersRouter.delete('/:userId', async (req, res, next) => {
        try {
           const id = Number(req.params.userId)
           await UserServiceInstance.removeUser(id, 'users', 'uid');

            res.status(201).send("User was deleted");
        } catch(err) {
            res.status(404).send(err)
        }
    })

    usersRouter.post('/newadmin', async (req, res, next) => {
        try {
            const { email, password, first_name, last_name } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt)
            console.log(hash)
            const data = {
                email, 
                password: hash, 
                first_name, 
                last_name, 
                is_admin: true,
                google_id: null,
                facebook_id: null
            }

            const response = await UserServiceInstance.newUser(data, 'users')
            res.status(201).send(response);
        } catch(err) {
            res.status(500).send(err)
        }
    })
}

// INSERT INTO films (_name, release_year)
// VALUES ('Monsters, Inc.', 2001);