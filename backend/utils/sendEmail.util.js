
import nodemailer from 'nodemailer';
import 'dotenv/config';

const secureSetting = process.env.EMAIL_SECURE !== undefined
    ? process.env.EMAIL_SECURE === 'true'
    : true;

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT || 465),
    secure: secureSetting,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000
});

const SendEmail = (to, subject, body) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('ERROR AL ENVIAR EL CORREO', error);
        } else {
            console.log(`CORREO ENVIADO ${info.response}`);
        }
    });
};

export { SendEmail };