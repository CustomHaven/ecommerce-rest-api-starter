const createError = require('http-errors');
const CrudModel = require('../models/CrudModel');
const CrudModelInstance = new CrudModel();
const OLService = require('./OLService');

module.exports = class OrderService {

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
                quantity: 20,
                store_products_spid: 6,
                spid: 6,
                customers_cid: 3,
                order_date: '2021-09-03 20:22:33',
                upper: upperBound,
                lower: lowerBound
            }

            const three = {
                customers_cid: 3,
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
}