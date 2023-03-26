const mongoose = require("../config/db");
const Schema = mongoose.Schema;

const transferOTPSchema = new Schema({
  sender_username: { type: String, require: true },
  receiver_username: { type: String, require: true },
  fee_payer: {type: String},
  money: {type: Number},
  message: {type: String},
  createAt: { type: Date, expires: 60},
  OTP: { type: String },
});

module.exports = mongoose.model("transferOTP", transferOTPSchema);