const createError = require('http-errors');
const moment = require('moment');
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

    static upper(date) {
        const copy = date;
        const upper = moment(copy, 'YYYY-MM-DD HH:mm:ss')
                        .add(3, 'minutes')
                        .add(1, 'hour');
        
        const upperBound = upper.toISOString(true).replace(/\.\d+\+\d+\:\d+/, '').replace(/T/, ' ');

        return upperBound;
    }

    static lower(date) {
        const copy = date;
        const lower = moment(copy, 'YYYY-MM-DD HH:mm:ss')
                        .subtract(3, 'minutes')
                        .add(1, 'hour');

        const lowerBound = lower.toISOString(true).replace(/\.\d+\+\d+\:\d+/, '').replace(/T/, ' ');

        return lowerBound;
    }

    static async fetchCustomer(id, tableName, idName) {
        try {
            const customers = await CrudModelInstance.findOne(id, tableName, idName)
            if (!customers) {
                return null
            }
            const [customer] = customers;
            return customer;
        } catch (err) {
            throw err
        }
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

            const finalPrice = await CrudModelInstance.selectPrice(priceFinalObj, 'order_list', 'store_products', 'price', three);

            if (!finalPrice) {
                throw createError(404, 'Cannot find the list of items bought by the customer');
            } else {
                const finalObj = {
                    customers_cid: Number(obj.customers_cid),
                    status_completed: obj.status_completed,
                    created_at: obj.created_at,
                    final_price: finalPrice
                }
    
                const order = await CrudModelInstance.newRow(finalObj, tableName);
    
                if (!order) {
                    throw createError(404, 'No new order recorded');
                }
                return order;
            }
        } catch(err) {
            throw err;
        }
    }

    async getOrderList(col, table, values) {
        try {
            const queryTables = await CrudModelInstance.queryThreeTables(col, table, values)
            if (!queryTables) {
                throw (404, 'Could not locate order list')
            }
            return queryTables
        } catch (err) {
            throw err
        }
    }

    async findAnOrder(id, tableName, idName) {
        try {
            const orders = await CrudModelInstance.findOne(id, tableName, idName);

            if (!orders) {
                throw createError(404, 'No order found');
            } else {
                const [order] = orders;
                const order_date = order.created_at.toISOString().replace(/[a-z]/i, ' ').replace(/\..+/, '');
                const customer = await OrderService.fetchCustomer(order.customers_cid, 'customers', 'cid');
                if (!customer) {
                    throw createError(404, 'Customer could not be found');
                }
                const upperBound = OrderService.upper(order_date)
                const lowerBound = OrderService.lower(order_date)

                const columns = {
                    customers_cid: order.customers_cid,
                    order_date: upperBound,
                    created_at: lowerBound,
                    product_name: 'cid',
                    price: 'quantity',
                    store_products_spid: 'spid'
                }
                const tables = {
                    store_products: 1,
                    order_list: 'order_list',
                    customers: 'customers'
                }
                const values = [
                    order.customers_cid,
                    upperBound,
                    lowerBound,
                    1
                ]

                const orderList = await this.getOrderList(columns, tables, values);

                const obj = {
                    order,
                    customer,
                    orderList
                }
                return obj;
            }
        } catch (err) {
            throw err
        }
    }
}