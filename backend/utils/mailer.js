const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jorgejosepelli@gmail.com',
    pass: 'dkarkuwcigbaebwl' // contraseña de aplicación sin espacios
  }
});

async function enviarCorreo(destinatario, asunto, mensajeHtml) {
  const mailOptions = {
    from: '"Artefactos del Ayer" <jorgejosepelli@gmail.com>',
    to: destinatario,
    subject: asunto,
    html: mensajeHtml
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Correo enviado a ${destinatario}: ${info.response}`);
  } catch (err) {
    console.error(`❌ Error enviando correo a ${destinatario}:`, err);
  }
}

module.exports = { enviarCorreo };
