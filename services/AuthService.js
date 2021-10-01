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
            console.log("login deserulize")
            // console.log(user)
            if (!user) {
                throw createError(404, 'No user found!')
            }
            return user
        } catch (error) {
            return error;
        }
    }

    async sess(data) { // not used delete this
        try {
            // const { session_id, expire } = data;
            const newObject = {};
            Object.assign(newObject, data);
            console.log('newObject')
            console.log(newObject)
            console.log('newObject')

            const session = CrudModelInstance.newRow(newObject, 'session');
            if (!session) {
                throw createError(401, 'Cookie failed to store')
            }
            return session;
        } catch (error) {
            return error;
        }
    }
}