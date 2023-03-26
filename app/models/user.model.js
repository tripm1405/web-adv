const mongoose = require("../config/db");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, require: true, unique: true },
  name: { type: String, require: true },
  phone: { type: String, require: true, unique: true },
  birthday: { type: String, require: true },
  address: { type: String, require: true },
  cmnd: { type: [String], require: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "Customer" },
  status: { type: String, default: "Chờ xác minh" },
  firstLogin: { type: Boolean, default: true },
  unusual: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  money: { type: Number, default: 0 },
});

module.exports = mongoose.model("user", userSchema);
