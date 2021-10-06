const createError = require('http-errors');
const CrudModel = require('../models/CrudModel');
const CrudModelInstance = new CrudModel();
const bcrypt = require('bcryptjs');

module.exports = class UserService {

    async allUsers(tableName) {
        try {

            const everyUser = await CrudModelInstance.getAll(tableName);

            if (!everyUser) {
                throw createError(404, 'Invalid path');
            }

            return everyUser;

        } catch(err) {
            throw err;
        }
    }

    async findOneUser(id, tableName, idName) {
        try {
            const users = await CrudModelInstance.findOne(id, tableName, idName);
            if (!users) {
                throw createError(404, 'User not found');
            }
            const [user] = users;

            return user;
            
        } catch(err) {
            throw err;
        }
    }
    async newUser(col, tableName) {
        try {
            const user = await CrudModelInstance.newRow(col, tableName);

            if (!user) {
                throw createError(500, 'Could not make a new user')
            }
            return user;
        } catch(err) {
            throw err;
        }
    }
    async updateUser(id, col, tableName, idName) {
        try {
            if (col.password) {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(col.password, salt);
                col.password = hash;
            }
            const user = await CrudModelInstance.updateRow(id, col, tableName, idName);

            if (!user) {
                throw createError(404, 'User not found so we cannot update what is not found in the Database');
            }

            return user;
            
        } catch(err) {
            throw err;
        }
    }

    async removeUser(id, tableName, idName) {
        try {

            const userRemoved = await CrudModelInstance.deleteRow(id, tableName, idName);

            if (userRemoved === null) {
                throw createError(404, 'Invalid ID no user found');
            }
            return userRemoved;

        } catch(err) {
            throw err;
        }
    }
}