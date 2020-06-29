import 'dotenv/config'
import nodemailer from 'nodemailer'
import handlebars from 'handlebars'
import path from 'path'
import fs from 'fs'

const credential = {
  email: process.env.MAIL_USERNAME,
  password: process.env.MAIL_PASSWORD,
}

// service ( smtp, zoho, mailgun, and others )
const transport = {
  service: process.env.MAIL_DRIVER,
  port: process.env.MAIL_PORT,
  secure: true,
  // ignoreTLS:true,
  // requireTLS:false,
  auth: {
    user: credential.email,
    pass: credential.password,
  },
}

const transporter = nodemailer.createTransport(transport)

transporter.verify((err, success) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Server mail it`s ready!')
  }
})

const readHTMLFile = (path, callback) => {
  fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
    if (err) {
      throw err
      // eslint-disable-next-line no-unreachable
      callback(err)
    } else {
      callback(null, html)
    }
  })
}

// get read html file from config
const SendMailer = (htmlTemplate, objData, optMail) => {
  readHTMLFile(
    path.resolve(__dirname, `../../public/email_template/${htmlTemplate}`),
    (err, html) => {
      const template = handlebars.compile(html)
      const htmlToSend = template(objData)
      const mailOptions = {
        from: `No Reply <${credential.email}>`,
        to: `${optMail.emailTo}`,
        subject: `${optMail.subject}`,
        html: htmlToSend,
      }
      // get transporter from config
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          console.log(err)
        } else {
          console.log('successfully', data)
        }
      })
    }
  )
}

export default SendMailer
