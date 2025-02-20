const nodemailer = require("nodemailer");

/* const emailRegister = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const { email, nombre, token } = datos;

 Enviar el correo
  await transport.sendMail({
    from: '"Bienvenidos👻" <maddison53@ethereal.email>', // dirección del remitente
    to: email, // destinatario
    subject: "Confirma tu cuenta en Bienes Raíces", // asunto
    text: "Confirma tu cuenta en Bienes Raíces", // mensaje en texto plano
    html: `<p>Hola ${nombre}, comprueba tu cuenta en Bienes Raíces </p>
    
        <p>Tu cuenta está lista, solo debes confirmar en el siguiente enlace:

        <a href=${process.env.FRONTEND_URL}/auth/confirm/${token}>Confirmar cuenta</a></p>
    `, // cuerpo del mensaje en HTML
  });
};

const emailRecover = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const { email, nombre, token } = datos;
 Enviar el correo
  await transport.sendMail({
    from: '"Bienvenidos👻" <maddison53@ethereal.email>', // dirección del remitente
    to: email, // destinatario
    subject: "Reestablece tu contraseña en Bienes Raíces", // asunto
    text: "Reestablece tu contraseña en Bienes Raíces", // mensaje en texto plano
    html: `<p>Hola ${nombre}, has solicitado restablecer tu contraseña en Bienes Raíces</p>
    
        <p>Sigue el siguiente enlace para generar una contraseña nueva:

        <a href=${process.env.FRONTEND_URL}/auth/recover/${token}>Reestablecer contraseña</a></p>
    `, // cuerpo del mensaje en HTML
  });
};

module.exports = { emailRegister, emailRecover }; */

require("dotenv/config");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: process.env.EMAIL_TOKEN,
});

const sentFrom = new Sender(
  "noreply@trial-jy7zpl92jq045vx6.mlsender.net",
  "Expenses and Profits"
);

const sendEmail = async (
  toEmail,
  userName,
  subject,
  htmlContent,
  textContent
) => {
  try {
    const recipients = [new Recipient(toEmail, userName)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(htmlContent)
      .setText(textContent);

    // Enviar el correo
    await mailerSend.email.send(emailParams);
    console.log("📩 Mail successfully sent to:", toEmail);
  } catch (error) {
    console.error("❌Error sending email:", error);
  }
};

module.exports = { sendEmail };
