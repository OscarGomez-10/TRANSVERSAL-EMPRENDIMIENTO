
import nodemailer from 'nodemailer';
import 'dotenv/config';

const secureSetting = process.env.EMAIL_SECURE !== undefined
    ? process.env.EMAIL_SECURE === 'true'
    : true;

const baseTransportConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT || 465),
    secure: secureSetting,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: Number(process.env.EMAIL_TIMEOUT || 10000),
    family: 4
};

const fallbackTransportConfig = (!process.env.EMAIL_HOST && !process.env.EMAIL_PORT)
    ? {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        connectionTimeout: Number(process.env.EMAIL_TIMEOUT || 10000),
        family: 4
    }
    : null;

const buildTransporters = () => {
    const configs = [baseTransportConfig];
    if (fallbackTransportConfig) {
        configs.push(fallbackTransportConfig);
    }
    return configs.map((config) => nodemailer.createTransport(config));
};

const SendEmail = (to, subject, body) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: body
    };

    const transporters = buildTransporters();

    const trySend = async () => {
        let lastError = null;
        for (const transporter of transporters) {
            try {
                const info = await transporter.sendMail(mailOptions);
                console.log(`CORREO ENVIADO ${info.response}`);
                return;
            } catch (error) {
                lastError = error;
                console.log('ERROR AL ENVIAR EL CORREO', error);
            }
        }
        if (lastError) {
            console.log('ENVÍO DE CORREO FALLÓ TRAS REINTENTOS');
        }
    };

    trySend().catch((error) => {
        console.log('ERROR NO CONTROLADO EN ENVÍO DE CORREO', error);
    });
};

export { SendEmail };