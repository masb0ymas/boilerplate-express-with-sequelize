import nodemailer from 'nodemailer'

require('dotenv').config()

const {
  APP_NAME,
  MAIL_DRIVER,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
} = process.env

function setMailConfig() {
  const configTransport = {
    service: MAIL_DRIVER,
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
      user: MAIL_USERNAME,
      pass: MAIL_PASSWORD,
    },
  }
  return configTransport
}

function setMailOptions(dest, subject, text) {
  return {
    from: `${APP_NAME} <${MAIL_USERNAME}>`,
    to: dest,
    subject,
    html: text,
  }
}

function sendMail(dest, subject, text) {
  const mailConfig = setMailConfig()
  const mailOptions = setMailOptions(dest, subject, text)
  // Nodemailer Transport
  const transporter = nodemailer.createTransport(mailConfig)
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('successfully', info)
    }
  })
}

class EmailProvider {
  // Public Method
  static send(to, subject, template) {
    const dest = Array.isArray(to) ? to.join(',') : to
    const text = template
    // send an e-mail
    sendMail(dest, subject, text)
  }
}

export default EmailProvider
