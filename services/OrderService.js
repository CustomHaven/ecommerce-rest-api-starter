const createError = require('http-errors');
const CrudModel = require('../models/CrudModel');
const CrudModelInstance = new CrudModel();
const OLService = require('./OLService');
const { EMAIL } = require('../config');
const nodemailer = require('nodemailer');

module.exports = class OrderService {

     constructor() {
        this.transport = nodemailer.createTransport({
            service: EMAIL.ESERVICE,
            auth: {
                user: EMAIL.EUSER,
                pass: EMAIL.EPASSWORD
            }
        })
    }

    async allOrders(tableName) {
        try {
            const orders = await CrudModelInstance.getAll(tableName);
        
            if (!orders) {
                throw createError(404, 'Currently no orders')
            }
            return orders;
        } catch(err) {
            throw err;
        }
    }

    async newOrder(obj, tableName) {
        try {
            const upperBound = OLService.upper(obj.created_at);
            const lowerBound = OLService.lower(obj.created_at);

            const priceFinalObj = {
                quantity: 20, // doesnt matter the number as we are only using Object.keys
                store_products_spid: 6, // doesnt matter the number as we are only using Object.keys
                spid: 6, // doesnt matter the number as we are only using Object.keys
                customers_cid: obj.customers_cid,
                order_date: '2021-09-03 20:22:33',
                upper: upperBound,
                lower: lowerBound
            }

            const three = {
                customers_cid: obj.customers_cid,
                upper: upperBound,
                lower: lowerBound
            }

            const final = await CrudModelInstance.selectPrice(priceFinalObj, 'order_list', 'store_products', 'price', three);
            const sumPrice = (Number(final.map(eee => eee.sum).join('')))

            const finalObj = {
                customers_cid: Number(obj.customers_cid),
                status_completed: obj.status_completed,
                created_at: obj.created_at,
                final_price: sumPrice
            }

            const order = await CrudModelInstance.newRow(finalObj, tableName);

            if (!order) {
                throw createError(404, 'No new order recorded');
            }

            return order;
        } catch(err) {
            throw err;
        }
    }

    async stupid() {
        consonle.log('I AM inside this class mail ORDER CLASS')
        // console.log(mail)
        // const { to, subject, text, html, attachments } = mail
        // const message = {
        //     from: EMAIL.EUSER,
        //     to,
        //     subject,
        //     text,
        //     html,
        //     attachments
        // }
        // const post = await this.transport.sendMail(message, (err, info) => {
        //     if (err) {
        //        return err
        //     } else {
        //        return info
        //     }
        // });

        // return post
        // return message
    }
}