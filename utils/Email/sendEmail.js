const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const { getMaxListeners } = require("process");
const { text } = require("express");

const sendEmail = async (email, subject, payload, template) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const source = await fs.readFileSync(path.join(__dirname, template), "utf8");
  const compiledTemplate = await handlebars.compile(source);

  const mailOptions = () => {
    return {
      from: "EXPRESS DELIVERY<expresseliverygh@gmail.com>",
      to: email,
      subject: subject,
      text: text,
      html: compiledTemplate(payload),
    };
  };

  const delivered = await transporter.sendMail(mailOptions());
  if (!delivered) throw new Error("Email not sent");
};

module.exports = sendEmail;
