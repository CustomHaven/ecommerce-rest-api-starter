const nodemailer = require('nodemailer');
const createError = require('http-errors');
const { EMAIL } = require('../config');

module.exports = class EmailService {

    constructor() {
        this.transport = nodemailer.createTransport({
            service: EMAIL.ESERVICE,
            auth: {
                user: EMAIL.EUSER,
                pass: EMAIL.EPASSWORD
            }
        })
    }

    async sendMessage(mail) {
        const { to, subject, html, attachments } = mail
        const message = {
            from: EMAIL.EFROM,
            to,
            subject,
            html,
            attachments
        }
        return await this.transport.sendMail(message, (err, info) => {
            if (err) {
                throw createError(500, err.message)
            } else {
                console.log(info)
            }
        });
    }
};