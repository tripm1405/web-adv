const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const History = new Schema({
  username: { type: String, required: true },
  type: { type: String, required: true },
  // ------------ thong tin mua the----------------
  nhacungcap: { type: String},
  menhgia: { type: String},
  soluong: { type: String},
  //--------------------------------------------
  // ------------ for transfer monney ----------------
  receiver_phone_number: { type: String },
  // ------------------------------------------------
  money: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  message: { type: String },
  status: { type: String }, //Success, Cancelled, Pending
});

module.exports = mongoose.model("History", History);
