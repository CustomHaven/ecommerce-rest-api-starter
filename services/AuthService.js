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
                throw createError(404, 'Incorrect email.', { expose: true })
            } else {
                const [user] = users
                const similarPassword = await bycrypt.compare(password, user.password);
                if (!similarPassword) {
                    throw createError(401, 'Incorrect password.', { expose: true })
                } else {
                    return user;
                }
            }
        } catch (error) {
            return error;
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
        } catch (error) {
            return error;
        }
    }

    async sessID(data) {
        try {
            const { id } = data;
            const sessions = await CrudModelInstance.findOne(id, 'session', 'sid');
            console.log('session id')
            console.log(sessions)
            console.log('session id')
            if (!sessions) {
                throw createError(404, 'No session found!', { expose: true })
            }
            const [session] = sessions;
            return session;
        } catch (error) {
            return error
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
        } catch (error) {
            return error
        }
    }
}