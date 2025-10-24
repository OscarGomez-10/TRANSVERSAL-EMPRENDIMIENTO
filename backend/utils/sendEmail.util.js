import nodemailer from 'nodemailer';

const SendEmail = (to, subject, body) => {

    const transporder = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html:body
    }

    transporder.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("ERROR AL ENVIAR EL CORREO", error);
        } else {
            console.log(`CORREO ENVIADO` + info.response);
        }
    })

} 

export {SendEmail} 