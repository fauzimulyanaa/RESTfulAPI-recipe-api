const nodemailer = require("nodemailer");
require("dotenv").config();

const base_url = process.env.BASE_URL;
const url_api = process.env.URL_API;

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const createEmail = (email, token, name, otp) => {
  return {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Reset Password",
    html: `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="Food Recipes App" />
        <meta name="keywords" content="Food Recipes, Javascript, NodeJS, ExpressJS" />
        <meta name="author" content="Riki Muhammad Nurhidayat" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <style>
        @import 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap';

        * {
            font-family: 'Open Sans', sans-serif;
            box-sizing: border-box;
        }

        .auth-title {
            text-align: center;
            color: white;
            margin: 0;
            margin-top: 30px;
            margin-bottom: 10px;
        }

        .auth-content {
            border: 2px solid #0a1d37;
            border-radius: 3px;
            line-height: 30px;
            max-width: 800px;
            margin: 0 auto;
            margin-bottom: 30px;
            padding: 25px;
        }

        .auth-button {
            background-color: #293b5f;
            text-decoration: none;
            text-align: center;
            border-radius: 5px;
            font-weight: bold;
            margin: 0 auto;
            padding: 5px;
            display: block;
            width: 100px;
        }
        </style>

        <title>Reset Password</title>
    </head>

    <body style="background-color: #efc81a; padding: 20px">
        <h1 class="auth-title">Food Recipes App</h1>
        <div class="auth-content" style="background-color: white">
        <p style="font-size: 20px">Hallo ${name}!</p>
        <hr />
        <p>
            We have received your request to reset the food recipe app password.
            <br />
            Please input the code below to reset your password.
        </p>
        <a href="#" style="color: white; letter-spacing: 7px; text-align: center" class="auth-button">${otp}</a>
        <p>
            If you don't feel like to reset password an account in the Food Recipes App, ignore this email.
            <br />
        </p>
        <hr />
        <p>
            Copyright &copy; ${new Date().getFullYear()} Food Recipes App - Developed with <span style="color: red !important">🔥</span> by
            <a style="text-decoration: none" href="https://github.com/rikimuhammadasli021299" target="_blank">Riki Muhammad Nurhidayat</a> in Tasik Rock City
        </p>
        </div>
    </body>
    </html>
    `,
  };
};

const sendOtpToMail = (email, token, name, otp) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(createEmail(email, token, name, otp), (err, info) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("Email Sent: " + info.response);
        resolve(true);
      }
    });
  });
};

module.exports = { sendOtpToMail };
