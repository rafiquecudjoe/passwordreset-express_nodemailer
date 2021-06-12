const express = require("express");
const JWT = require("jsonwebtoken");
const User = require("../models/userSchema");
const Token = require("../models/token.model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const userSchema = require("../models/userSchema");
const sendEmail = require("../utils/Email/sendEmail");
const { response } = require("express");

const Router = express();

JWT_SECRET = process.env.JWT_SECRET;
bcryptSalt = process.env.BCRYPT_SALT;
clientURL = process.env.CLIENT_URL;

Router.post("/signup", async function (request, response) {
  const { email, fullname, password } = request.body;

  let user = await User.findOne({ email });

  if (user) {
    throw new Error("Email already exist");
  } else {
    user = new User({ fullname, email, password });

    let token = JWT.sign({ id: user._id }, JWT_SECRET);

    let responseData = user.save();

    if (responseData) {
      response.status(200).send({
        success: true,
        data: (responseData = {
          userId: user._id,
          email: user.email,
          fullname: user.fullname,
          token: token,
        }),
      });
    } else {
      response.status(300).send({ success: false });
      console.log(err);
    }
  }
});

Router.post("/requestRequestpassword", async function (request, response) {
  const { email } = request.body;

  const user = await User.findOne({ email });

  if (!user) throw new Error("User does not exist");

  let token = await Token.findOne({ userId: user.id });
  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

  await new Token({
    userId: user.id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${clientURL}/passwordreset?token=${resetToken}&id=${user._id}`;

  await sendEmail(
    user.email,
    "Password Reset Request",
    { name: user.fullname, link: link },
    "./template/requestResetPassword.handlebars"
  );
  response.status(200).send({ success: true, data: link });
});

Router.post("/passwordreset", async function (request, response) {
  const { token, password, userId } = request.body; //Will work on this

  let passwordResetToken = await Token.findOne({ userId });

  if (!passwordResetToken)
    throw new Error("Invalid or Expired Password Reset token");

  const isValid = await bcrypt.compare(token, passwordResetToken.token);

  if (!isValid) throw new Error("Invalid or Expired Password Reset Tokens");

  const hash = await bcrypt.hash(password, Number(bcryptSalt));
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );
  const user = await User.findById({ _id: userId });

  await sendEmail(
    user.email,
    "Password Reset Successfully",
    { name: user.fullname },
    "./template/resetPassword.handlebars"
  ).catch((err) => console.log(err));

  await passwordResetToken.deleteOne();
  response
    .status(200)
    .send({ success: true, data: "Password Reset Seccuessful" });
});

module.exports = Router;
