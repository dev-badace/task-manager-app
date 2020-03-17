const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) => {
  sgMail.send({
    to: 'shibru127@gmail.com',
    from: email,
    subject: 'this is my first sg mail',
    text: `hey there ${name}`
  })
}

module.exports = {
  sendWelcomeEmail
}
