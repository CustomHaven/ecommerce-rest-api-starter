const createError = require('http-errors');
const CrudModel = require('../models/CrudModel');
const CrudModelInstance = new CrudModel();
const bycrypt = require('bcryptjs');

module.exports = class AuthService {
    
    async localLogin(data) {
        try {
            const { email, password } = data;
            const users = await CrudModelInstance.findOneByEmail(email, 'users', 'email');

            if (!users) {
                throw createError(404, 'Incorrect email.', { expose: true });
            } else {
                const [user] = users
                const similarPassword = await bycrypt.compare(password, user.password);
                if (!similarPassword) {
                    throw createError(401, 'Incorrect password.', { expose: true });
                } else {
                    return user;
                }
            }
        } catch (err) {
            throw err;
        }
        
    }

    async loginId(data) {
        try {
            const { id } = data;
            const [user]= await CrudModelInstance.findOne(id, 'users', 'id');
            if (!user) {
                throw createError(404, 'No user found!')
            }
            return user
        } catch (err) {
            throw err;
        }
    }

    async sessID(data) {
        try {
            const { id } = data;
            const sessions = await CrudModelInstance.findOne(id, 'session', 'sid');
            if (!sessions) {
                throw createError(404, 'No session found!'); // placed throw err in catch so i can do false
                // return null
            }
            const [session] = sessions;
            return session;
        } catch (err) {
            throw err;
        }
    }

    async deleteSess(data) {
        try {
            const { id } = data;
            const session = await CrudModelInstance.deleteRow(id, 'session', 'sid');
            if (!session) {
                throw createError(404, 'No session found!')
            }
            return session;
        } catch (err) {
           throw err;
        }
    }
}