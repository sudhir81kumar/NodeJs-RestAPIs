const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();


let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = { transporter }