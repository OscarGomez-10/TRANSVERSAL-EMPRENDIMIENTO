// ENVIAR CORREOS 
import nodemailer from "nodemailer"
import "dotenv/config"

const sendEmail = (to, subject, body) => {
  // Crear el transporte con los detalles de la cuenta 
  const transporter = nodemailer.createTransport({
    service: 'gmail', // o el servicio que uses 
    auth: {
      user: process.env.EMAIL_USER, // tu correo 
      pass: process.env.EMAIL_PASS, // tu contraseña 
    },
  });

  const mailOptions = {// Opciones del correo 
    from: process.env.EMAIL_USER, // El correo desde el cual se enviará 
    to: to, // Correo de destino 
    subject: subject, 
    html: body , // cuerpo en HTML (si lo mandas)
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo: ', error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
}


export{
    sendEmail
}