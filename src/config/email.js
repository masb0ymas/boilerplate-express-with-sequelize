import nodemailer from 'nodemailer'
import { google } from 'googleapis'

require('dotenv').config()

const {
  APP_NAME,
  MAIL_DRIVER,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_AUTH_TYPE,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REFRESH_TOKEN,
  OAUTH_REDIRECT_URL,
} = process.env

function setMailConfig() {
  const configTransport = {
    service: MAIL_DRIVER,
    auth: {
      user: MAIL_USERNAME,
    },
  }

  // Use Google OAuth
  if (MAIL_AUTH_TYPE === 'OAuth2') {
    const oauth2Client = new google.auth.OAuth2(
      OAUTH_CLIENT_ID,
      OAUTH_CLIENT_SECRET,
      OAUTH_REDIRECT_URL
    )

    oauth2Client.setCredentials({
      refresh_token: OAUTH_REFRESH_TOKEN,
    })

    const accessToken = async () => {
      const result = await oauth2Client.getRequestHeaders()
      return result
    }

    configTransport.auth.type = MAIL_AUTH_TYPE
    configTransport.auth.clientId = OAUTH_CLIENT_ID
    configTransport.auth.clientSecret = OAUTH_CLIENT_SECRET
    configTransport.auth.refreshToken = OAUTH_REFRESH_TOKEN
    configTransport.auth.accessToken = accessToken()
  } else {
    // SMTP Default
    configTransport.host = MAIL_HOST
    configTransport.port = MAIL_PORT
    configTransport.auth.pass = MAIL_PASSWORD
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

async function composeEmail(to, subject, template) {
  const dest = Array.isArray(to) ? to.join(',') : to
  const text = template
  // send an e-mail
  sendMail(dest, subject, text)
}

export default composeEmail
