const joi = require("@hapi/joi");

const schemaRegister = joi.object({
  name: joi.string().required(),
  email: joi.string().email().lowercase().required(),
  phone: joi
    .string()
    .regex(/^[0-9]+$/)
    .max(11)
    .required(),
  birthday: joi.date().required(),
  address: joi.string().required(),
});

const chemaLogin = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});

const chemaChangePassword = joi.object({
  oldPassword: joi.string().required().label("Vui lòng điền mật khẩu cũ"),
  newPassword: joi.string().required().label("Vui lòng điền mật khẩu mới"),
});

const chemaChangePasswordFirst = joi.object({
  newPassword: joi.string().required().label("Vui lòng điền mật khẩu mới"),
});

const chemaResetPassword = joi.object({
  newPassword: joi.string().required().label("Vui lòng điền đầy đủ"),
});

const schemaDepositMoney = joi.object({
  card_number: joi.string().required().label("Vui lòng nhập số thẻ"),
  exp_date: joi.date().required().label("Vui lòng nhập ngày hết hạn"),
  amount: joi
    .number()
    .min(50000)
    .required()
    .label("Số tiền cần lớn hơn hoặc bằng 50.000"),
  cvv: joi.string().required().label("Vui lòng nhập mã cvv"),
});

const schemaWithdrawMoney = joi.object({
  card_number: joi.string().required().label("Vui lòng nhập số thẻ"),
  exp_date: joi.date().required().label("Vui lòng nhập ngày hết hạn"),
  amount: joi
    .number()
    .min(50000)
    .required()
    .label("Số tiền cần lớn hơn hoặc bằng 50.000"),
  cvv: joi.string().required().label("Vui lòng nhập mã cvv"),
  message: joi.string().required().label("Vui lòng nhập ghi chú"),
});
const schemaTransferMoney = joi.object({
  phone_number: joi
    .string()
    .regex(/^[0-9]+$/)
    .min(10)
    .max(10)
    .required()
    .label("Số điện thoại không hợp lệ"),
  amount: joi.number().required().label("Vui lòng nhập số tiền"),
  message: joi.string().required().label("Vui lòng nhập tin nhắn"),
  fee: joi
    .string()
    .required()
    .valid("sender", "receiver")
    .label("Thông tin người trả phí không hợp lệ"),
});

module.exports = {
  schemaRegister,
  chemaLogin,
  chemaChangePassword,
  chemaChangePasswordFirst,
  chemaResetPassword,
  schemaDepositMoney,
  schemaWithdrawMoney,
  schemaTransferMoney,
};
