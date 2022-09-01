const { PAYMENT } = require("../../config");
const router = require('express').Router();
const TableService = require('../../services/TableService');
const TableServiceInstance = new TableService();
const { isAdmin, limitIDAccess, authenticationMiddleware } = require('../../helpers/authHelper');
const stripe = require('stripe')(PAYMENT.SECRET);



module.exports = (app) => {
    app.use("/v2/payment-details", router);

    router.param("user_id", async (req, res, next) => {
        try {
            const user = await TableServiceInstance.findOneRow(req.params.user_id, "users", "id");
            limitIDAccess(user, req.user);
            req.userInfo = user;
            const contact = await TableServiceInstance.findOneRow(req.userInfo.id, "contact_details", "user_id");
            req.contact = contact
            next();
        } catch (error) {
            next(error);
        }
    });

    router.param("id", async (req, res, next) => {
        try {
            const payment = await TableServiceInstance.findOneRow(req.params.id, 'payment_details', 'id');
            req.payment = payment;
            next();
        } catch (error) {
            next(error);
        }
    });

    router.get("/", isAdmin, async (req, res, next) => { // isAdmin to view all payments
        try {
            const response = await TableServiceInstance.allRows("payment_details");
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });

    router.get("/publish-key", authenticationMiddleware, (req, res) => {
        res.status(200).json({ publishKey: PAYMENT.PUBLIC });
    });

    router.post("/create-payment-intent", authenticationMiddleware, async (req, res) => {

        const { paymentMethodType, currency, amount } = req.body;
    
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: currency,
                payment_method_types: [paymentMethodType]
            });
            res.send({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
            res.status(400).json({ error: { message: error.message }}); // next(error) should do instead!??
        }
    });

    
    router.post("/:user_id", authenticationMiddleware, async (req, res, next) => { // call it something backend /backend/:user_id
        try {
            const { name_on_card, card_type, card_number, expiry_date, cvv } = req.body;


            // I am trying to rob someone lol with this code
            const userName = req.userInfo.first_name + " " + req.userInfo.last_name;
            const customer = await stripe.customers.create({
                address: {
                    city: req.contact.town_city,
                    country: req.contact.country,
                    line1: req.contact.address_line1,
                    line2: req.contact.address_line2,
                    postal_code: req.contact.zip_code
                },
                email: req.userInfo.email,
                name: userName.replace(/(^\w{1})|(\s\w{1})/g, (v) => v.toUpperCase())
            });


            const paymentMethod = await stripe.paymentMethods.create({
                type: "card",
                card: {
                    number: card_number,
                    exp_month: parseInt(expiry_date?.replace(/^\d+-/, "")),
                    exp_year: parseInt(expiry_date?.replace(/-\d+$/, "")),
                    cvc: String(cvv),
                },
            });
            
            await stripe.paymentMethods.attach(
                paymentMethod.id,
                {customer: customer.id}
            );

// 4000008260003178 // Insufficient funds credit card

            const paymentIntent = await stripe.paymentIntents.create({
                amount: 2000,
                currency: "usd",
                customer: customer.id,
                payment_method: paymentMethod.id
            });

            // Might probably take paymentIntent to a different route
            const paymentIntentConfirm = await stripe.paymentIntents.confirm(
                paymentIntent.id,
                {
                    payment_method: paymentMethod.id
                }
            );
            

            // Maybe make another column saying paid string yes or no
            // And move this to the other route with paymenyIntents.confirm
            const data = {
                user_id: req.userInfo.id,
                name_on_card: name_on_card?.toUpperCase(),
                card_type: card_type?.toUpperCase(),
                card_number: parseInt(card_number),
                expiry_date,
                cvv: parseInt(cvv)
            }

            // So move these to the other route
            if (paymentIntentConfirm.charges.data.length > 0) {
                await TableServiceInstance.newRow(data, "payment_details");
            } else {
                console.log("payment failed"); // keeping this so I can keep record
            }

            res.status(201).send(paymentIntentConfirm.id); // send just the ID back then use it to for sending an email later? another stripe routes?
        } catch (error) {
            next(error);
        }
    });

    router.get("/:id", authenticationMiddleware, async (req, res, next) => {
        try {
            res.status(200).send(req.payment);
        } catch(err) {
            next(err);
        }
    });

    router.put('/:id', authenticationMiddleware, async (req, res, next) => {
        try {
            // "name_on_card": "Opaline Reuven",
            // "card_type": "jcb",
            // "card_number": "3542714688955009",
            const payment = req.payment;
            for (const key in req.body) {
                if (req.body[key] === '' || req.body[key] === null || req.body[key] === undefined) {
                    delete req.body[key]
                } else {
                    if (typeof req.body[key] === "string") {
                        req.body[key] = req.body[key]?.toUpperCase();
                    }
                }
            }
            req.body.modified = 'NOW()';

            const paymentUpdate = await TableServiceInstance.updateRow(payment.id, req.body, 'payment_details', 'id');
            res.status(201).send(paymentUpdate);
        } catch(err) {
            next(err);
        }
    });

    router.delete('/:id', authenticationMiddleware, async (req, res, next) => {
        try {
            await TableServiceInstance.removeRow(Number(req.payment.id), 'payment_details', 'id');
            res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    });
};