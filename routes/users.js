const usersRouter = require('express').Router();
const UserService = require('../services/UserService');
const UserServiceInstance = new UserService();

// change this to super admins instead!
module.exports = (app) => {
    app.use('/users', usersRouter);

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
            const response = await UserServiceInstance.newUser(req.body, 'users')
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
}

// INSERT INTO films (name, release_year)
// VALUES ('Monsters, Inc.', 2001);