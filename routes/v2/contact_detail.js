const router = require('express').Router();
const TableService = require('../../services/TableService');
const TableServiceInstance = new TableService();
const { isAdmin, limitIDAccess, authenticationMiddleware } = require('../../helpers/authHelper');

module.exports = (app) => {
    app.use("/v2/contact-details", router);

    router.param("user_id", async (req, res, next) => {
        try {
            const user = await TableServiceInstance.findOneRow(req.params.user_id, "users", "id");

            limitIDAccess(user, req.user);

            req.userInfo = user;
            next();
        } catch (error) {
            next(error);
        }
    });

    router.param("id", async (req, res, next) => {
        try {
            const contact = await TableServiceInstance.findOneRow(req.params.id, 'contact_details', 'id');
            req.contact = contact;
            next();
        } catch (error) {
            next(error);
        }
    });

    router.get("/", isAdmin, async (req, res, next) => { // isAdmin to view all contacts
        try {
            const response = await TableServiceInstance.allRows("contact_details");
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });

    router.post("/:user_id", authenticationMiddleware, async (req, res, next) => {
        try {
            const { address_line1, address_line2, town_city, zip_code, country } = req.body;
            
            const data = {
                user_id: req.userInfo.id,
                address_line1: address_line1?.toLowerCase(),
                address_line2: address_line2?.toLowerCase(),
                town_city: town_city?.toLowerCase(),
                zip_code: zip_code?.toLowerCase(),
                country: country?.toLowerCase(),
            }

            const contact = await TableServiceInstance.newRow(data, "contact_details");

            res.status(201).send(contact);
        } catch (error) {
            next(error);
        }
    });

    router.get("/:id", authenticationMiddleware, async (req, res, next) => {
        try {
            res.status(200).send(req.contact);
        } catch(err) {
            next(err);
        }
    });

    router.put('/:id', authenticationMiddleware, async (req, res, next) => {
        try {
            const contact = req.contact;
            for (const key in req.body) {
                if (req.body[key] === '' || req.body[key] === null || req.body[key] === undefined) {
                    delete req.body[key]
                } else {
                    if (typeof req.body[key] === "string") {
                        req.body[key] = req.body[key]?.toLowerCase();
                    }
                }
            }
            req.body.modified = 'NOW()';

            const contactUpdate = await TableServiceInstance.updateRow(contact.id, req.body, 'contact_details', 'id');
            res.status(201).send(contactUpdate);
        } catch(err) {
            next(err);
        }
    });

    router.delete('/:id', authenticationMiddleware, async (req, res, next) => {
        try {
            const contact = req.contact;
            await TableServiceInstance.removeRow(contact.id, 'contact_details', 'id');
            res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    })
};