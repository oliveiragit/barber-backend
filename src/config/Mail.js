require('dotenv/config')
module.exports= {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE, //LEMBRAR
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: process.env.MAIL_FROM,
  },
}

/**
 * Amazon SES
 * Mailgun
 * Sparkpost
 * Mandril (Mailchimp)
 * Mailtrap (DEV)
 */