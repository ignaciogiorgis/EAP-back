import nodemailer from "nodemailer";

const emailRegister = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const { email, nombre, token } = datos;

  // Enviar el correo
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

  // Enviar el correo
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

export { emailRegister, emailRecover };
