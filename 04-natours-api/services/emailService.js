/**
 * Service to Send Email
 */

const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');
const pug = require('pug');
const htmlToText = require('html-to-text');

const transport = mailgunTransport({
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
});

module.exports = class EmailService {
  constructor(user, url) {
    this.emailClient = nodemailer.createTransport(transport);
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Natours Test <${process.env.EMAIL_FROM}>`;
  }

  /**********************************************************************
   * ! Create Reusable Transporter Object using the Default SMTP Transport
   *********************************************************************/

  transporter() {
    /**************************
     * ! Production Environment
     **************************/
    if (process.env.NODE_ENV === 'production') {
      /** [sendGrid] **/
      // return nodemailer.createTransport({
      //   service: 'SendGrid',
      //   auth: {
      //     user: process.env.SENDGRID_EMAIL_USERNAME,
      //     pass: process.env.SENDGRID_EMAIL_PASSWORD,
      //   },
      // });

      /** [mailGun] **/
      return nodemailer.createTransport(
        mailgunTransport({
          auth: {
            api_key: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN,
          },
        })
      );
    }

    /***************************
     *! Development Environment!
     **************************/

    /* [MailGun] */
    // return nodemailer.createTransport({
    //   host: process.env.MAILGUN_EMAIL_HOST,
    //   port: process.env.MAILGUN_EMAIL_PORT,
    //   auth: {
    //     user: process.env.MAILGUN_EMAIL_USERNAME,
    //     pass: process.env.MAILGUN_EMAIL_PASSWORD,
    //   },
    // });

    /* [MailTrap] */
    return nodemailer.createTransport({
      host: process.env.MAILTRAP_EMAIL_HOST,
      port: process.env.MAILTRAP_EMAIL_PORT,
      auth: {
        user: process.env.MAILTRAP_EMAIL_USERNAME,
        pass: process.env.MAILTRAP_EMAIL_PASSWORD,
      },
    });
  }

  /****************************
   *  ! Send the Actual Email !
   ***************************/
  async send(template, subject) {
    /*1 Render HTML for email based on a pug templates */
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    /*2. Setup Email Data with unicode symbols */
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    /*3 send mail with defined transport object */
    await this.transporter().sendMail(mailOptions);
    //await this.emailClient.sendMail(mailOptions);
  }

  /****************************
   *  ! Send Welcome Email !
   ***************************/
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  /******************************
   *! Send Password Reset Email!
   *****************************/
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your Password Reset Token (Valid for 10 mins only)'
    );
  }
};
