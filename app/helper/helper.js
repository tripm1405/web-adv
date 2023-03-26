const nodemailer = require("nodemailer");
require("dotenv").config();

// require models
const userModel = require("../models/user.model");
const historyModel = require("../models/history.model");
const blacklistUserModel = require("../models/blacklist.model");

exports.generateRandomLetter = (n) => {
  const listCharacter = "abcdefghijklmnopqrstuvwxyz0123456789`!@#$%^&*?><|";
  let randomString = "";
  for (let i = 0; i < n; i++) {
    randomString +=
      listCharacter[Math.floor(Math.random() * listCharacter.length)];
  }
  return randomString;
};

exports.generateRandomNumber = (n) => {
  const listNumber = "0123456789";
  let randomString = "";
  for (let i = 0; i < n; i++) {
    randomString += listNumber[Math.floor(Math.random() * listNumber.length)];
  }
  return randomString;
};

exports.sendEmailRegister = async (email, username, password) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASS_EMAIL,
    },
  });
  const mailOptions = {
    from: "Delta E-Wallet", // sender address
    to: email, // list of receivers
    subject: "Đăng Ký Ví Điện Tử", // Subject line
    // text: "Chức mừng bạn đã đăng ký thành công",
    html: `<h3>Chức mừng bạn đã đăng ký thành công</h3><p>Tài khoản: ${username}</p><p>Mật khẩu: ${password}</p>`,
    // html:  fs.readFileSync(__dirname+`/404.html`),
  };
  let info = await transporter.sendMail(mailOptions);
};

exports.sendEmailResetPassword = async (email, token) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASS_EMAIL,
    },
  });
  const mailOptions = {
    from: "Delta E-Wallet",
    to: email,
    subject: "Khôi phục mật khẩu",
    html: `Nhấn vào đây để khôi phục mật khẩu (Link chỉ tồn tại trong 10 phút) ==> <a href="http://localhost:3000/reset-password/${token}">Khôi phục mật khẩu</a> `,
  };
  let info = await transporter.sendMail(mailOptions);
};

exports.login_attempts = async (req, user) => {
  if (req.session["login_attempts"] == undefined) {
    req.session["login_attempts"] = 1;
  } else {
    req.session["login_attempts"]++;
  }

  if (req.session["login_attempts"] >= 3) {
    req.session["login_attempts"] = 0;
    await userModel
      .findOneAndUpdate(
        { username: user.username },
        { unusual: user.unusual + 1 }
      )
      .exec();
    return true;
  }
  return false;
};

exports.addBackList = async (user) => {
  if (user.unusual == 2) {
    await blacklistUserModel.create({
      username: user.username,
    });
    return true;
  }
  return false;
};

exports.sendEmailTransferOTP = async (email, OTP) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASS_EMAIL,
    },
  });
  const mailOptions = {
    from: "Delta E-Wallet",
    to: email,
    subject: "OTP Chuyển Tiền",
    html: `Mã OTP (tồn tại trong 1 phút): ${OTP}`,
  };
  let info = await transporter.sendMail(mailOptions);
};

exports.login_attempts = async (req, user) => {
  if (req.session["login_attempts"] == undefined) {
    req.session["login_attempts"] = 1;
  } else {
    req.session["login_attempts"] += 1;
  }

  if (req.session["login_attempts"] >= 3) {
    req.session["login_attempts"] = 0;
    await userModel.findOneAndUpdate(
      { username: user.username },
      { unusual: user.unusual + 1 }
    );
    return true;
  }
  return false;
};

exports.getUserInfo = async (user) => {
  return await userModel.findOne({ username: user.username }).exec();
};

exports.CreateDepositHistory = async (user, amount, card_number) => {
  await historyModel.create({
    username: user.username,
    type: "Deposit",
    receiver_phone_number: "",
    money: amount,
    message: card_number,
    status: "Success",
  });
};

exports.CreateBuyCardHistory = async (
  user,
  nhacungcap,
  menhgia,
  soluong,
  moneyBuyCards,
  id_card
) => {
  await historyModel.create({
    username: user.username,
    nhacungcap: nhacungcap,
    menhgia: menhgia,
    soluong: soluong,
    type: "Buy Card",
    money: moneyBuyCards,
    message: id_card.toString(),
    status: "Success",
  });
};
