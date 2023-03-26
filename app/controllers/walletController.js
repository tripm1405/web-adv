const formidable = require("formidable");

//Required models
const User = require("../models/user.model");
const History = require("../models/history.model");
const transferOTP = require("../models/transferOTP");

//Required middlewares
const middleware = require("../middlewares/validator");

//Require helper
const helper = require("../helper/helper");

class WalletController {
  // Deposit request
  async deposit(req, res) {
    try {
      try {
        await middleware.schemaDepositMoney.validateAsync(req.body);
      } catch (err) {
        return res
          .status(400)
          .json({ code: 400, message: err.details[0].context.label });
      }

      const { card_number, exp_date, amount, cvv } = req.body;

      const user = await User.findOne({ username: req.user.username }); //fake req.user.username: '2591335824'
      if (!user) {
        return res
          .status(400)
          .json({ code: 400, message: "Tài khoản không tồn tại" });
      }
      switch (card_number) {
        case "111111": {
          if (exp_date !== "2022-10-10" || cvv !== "411") {
            return res
              .status(400)
              .json({ code: 400, message: "Thông tin thẻ không hợp lệ" });
          }

          let curr_money = user.money;
          let newMoney = Number.parseInt(amount) + Number.parseInt(curr_money);
          try {
            await User.findByIdAndUpdate(user.id, { money: newMoney });
          } catch (error) {
            console.log(error);
          }
          await helper.CreateDepositHistory(user, amount, card_number);
          return res.status(200).json({ message: "Nạp tiền thành công" });
        }
        case "222222": {
          if (exp_date !== "2022-11-11" || cvv !== "443") {
            return res
              .status(400)
              .json({ code: 400, message: "Thông tin thẻ không hợp lệ" });
          }
          if (amount > 1000000) {
            return res
              .status(400)
              .json({ code: 400, message: "Số tiền nạp tối đa là 1.000.000" });
          }
          let curr_money = user.money;
          let newMoney = Number.parseInt(amount) + Number.parseInt(curr_money);
          try {
            await User.findByIdAndUpdate(user.id, { money: newMoney });
          } catch (error) {
            console.log(error);
          }
          await helper.CreateDepositHistory(user, amount, card_number);
          return res.status(200).json({ message: "Nạp tiền thành công" });
        }
        case "333333": {
          if (exp_date !== "2022-12-12" || cvv !== "577") {
            return res
              .status(400)
              .json({ code: 400, message: "Thông tin thẻ không hợp lệ" });
          }
          return res.status(400).json({ code: 400, message: "Thẻ hết tiền" });
        }
        default: {
          return res
            .status(400)
            .json({ code: 400, message: "Thẻ không được hỗ trợ" });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ code: 400, message: "Lỗi" });
    }
  }

  // Withdraw request
  async withdraw(req, res) {
    try {
      try {
        await middleware.schemaWithdrawMoney.validateAsync(req.body);
      } catch (err) {
        return res
          .status(400)
          .json({ code: 400, message: err.details[0].context.label });
      }

      let { card_number, exp_date, amount, cvv, message } = req.body;
      amount = Number.parseInt(amount);
      if (card_number !== "111111") {
        return res
          .status(400)
          .json({ code: 400, message: "Thẻ không được hỗ trợ." });
      }
      if (exp_date !== "2022-10-10" || cvv !== "411") {
        return res
          .status(400)
          .json({ code: 400, message: "Thông tin thẻ không hợp lệ" });
      }
      if (amount < 50000) {
        return res.status(400).json({
          code: 400,
          message: "Số tiền phải lớn hơn hoặc bằng 50,000đ.",
        });
      }
      if (amount % 50000 !== 0) {
        return res.status(400).json({
          code: 400,
          message: "Số tiền phải là bội số của 50,000đ. Vd: 100,000đ.",
        });
      }

      const user = await User.findOne({ username: req.user.username });
      if (!user) {
        return res
          .status(400)
          .json({ code: 400, message: "Tài khoản không tồn tại" });
      }
      let withdraw_fee = (amount / 100) * 5;
      let curr_money = user.money;
      if (curr_money < amount + withdraw_fee) {
        return res
          .status(400)
          .json({ code: 400, message: "số tiền hiện tại không đủ" });
      }

      // Check withdraw times
      const check_history = await History.find({
        username: user.username,
        type: "Withdraw",
      });
      check_history.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      if (check_history.length > 1) {
        const withdraw_date_diff =
          check_history[0].date.getDate() - check_history[1].date.getDate();
        const today = new Date().getDate();
        if (
          withdraw_date_diff === 0 &&
          today === check_history[0].date.getDate()
        ) {
          return res.status(400).json({
            code: 400,
            message: "Bạn đã thực hiện 2 giao dịch hôm nay",
          });
        }
      }
      if (amount >= 5000000) {
        const history = new History({
          username: user.username,
          type: "Withdraw",
          receiver_phone_number: "",
          money: amount,
          message: message,
          status: "Pending",
        });
        await history.save();
        return res.status(200).json({
          code: 200,
          message: "Thực hiện thành công, chờ admin xác minh",
        });
      }

      curr_money = user.money - amount - withdraw_fee;
      await User.findOneAndUpdate(
        { username: user.username },
        { money: curr_money }
      );
      // Add history
      const history = new History({
        username: user.username,
        type: "Withdraw",
        receiver_phone_number: "",
        money: amount,
        message: message,
        status: "Success",
      });
      await history.save();
      return res
        .status(200)
        .json({ code: 200, message: "Rút tiền thành công" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ code: 400, message: "Lỗi" });
    }
  }

  async transfer(req, res) {
    try {
      try {
        await middleware.schemaTransferMoney.validateAsync(req.body);
      } catch (err) {
        return res
          .status(400)
          .json({ code: 400, message: err.details[0].context.label });
      }

      let { phone_number, amount, message, fee } = req.body;
      amount = Number.parseInt(amount);

      if (amount < 50000) {
        return res.status(400).json({
          code: 400,
          message: "Số tiền phải lớn hơn hoặc bằng 50,000đ.",
        });
      }
      if (amount % 50000 !== 0) {
        return res.status(400).json({
          code: 400,
          message: "Số tiền phải là bội số của 50,000đ. Vd: 100,000đ.",
        });
      }

      const receiver_user = await User.findOne({ phone: phone_number });
      const sender_user = await User.findOne({ username: req.user.username });
      if (!receiver_user) {
        return res
          .status(400)
          .json({ code: 400, message: "Tài khoản không tồn tại" });
      }
      if (sender_user.phone === phone_number) {
        return res
          .status(400)
          .json({ code: 400, message: "Không thể tự gửi tiền cho bản thân" });
      }

      //check fee_payer
      let transfer_fee = (amount / 100) * 5;
      //Sender
      if (fee === "sender") {
        let curr_money = sender_user.money;
        if (curr_money < amount + transfer_fee) {
          return res
            .status(400)
            .json({ code: 400, message: "Số tiền hiện tại không đủ" });
        }

        const OTP = helper.generateRandomNumber(6);
        await helper.sendEmailTransferOTP(sender_user.email, OTP);

        const transfer_otp = new transferOTP({
          sender_username: sender_user.username,
          receiver_username: receiver_user.username,
          fee_payer: "Sender",
          money: amount,
          message: message,
          createAt: Date.now(),
          OTP: OTP,
        });
        await transfer_otp.save();
        return res
          .status(200)
          .json({ code: 200, message: "Mã OTP đã được gửi đến email" });
      }

      //Receiver
      if (fee === "receiver") {
        let curr_money = sender_user.money;
        if (curr_money < amount) {
          return res
            .status(400)
            .json({ code: 400, message: "Số tiền hiện tại không đủ" });
        }

        const OTP = helper.generateRandomNumber(6);
        console.log(OTP);
        await helper.sendEmailTransferOTP(sender_user.email, OTP);

        const transfer_otp = new transferOTP({
          sender_username: sender_user.username,
          receiver_username: receiver_user.username,
          fee_payer: "Receiver",
          money: amount,
          message: message,
          createAt: Date.now(),
          OTP: OTP,
        });
        await transfer_otp.save();
        return res
          .status(200)
          .json({ code: 200, message: "Mã OTP đã được gửi đến email" });
      }
    } catch (error) {
      return res.status(400).json({ code: 400, message: "Lỗi" });
    }
  }

  async verifyOTP(req, res) {
    try {
      const { OTP } = req.body;

      if (!OTP || OTP.length !== 6) {
        return res.status(400).json({ code: 400, message: "OTP không hợp lệ" });
      }

      const tmp = await transferOTP.find({
        sender_username: req.user.username,
      });
      tmp.sort((a, b) => {
        return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
      });
      const dt = tmp[0];

      if (!dt) {
        return res.status(400).json({ code: 400, message: "OTP hết hạn" });
      }

      if (new Date(dt.createAt).getTime() + 60000 < Date.now()) {
        return res.status(400).json({ code: 400, message: "OTP hết hạn" });
      }

      if (OTP !== dt.OTP) {
        return res.status(400).json({ code: 400, message: "Sai OTP" });
      }

      // process transactions
      let transfer_fee = (dt.money / 100) * 5;
      const receiver_user = await User.findOne({
        username: dt.receiver_username,
      });
      const sender_user = await User.findOne({ username: req.user.username });

      if (dt.money >= 5000000) {
        const history = new History({
          username: sender_user.username,
          type: "Transfer",
          receiver_phone_number: receiver_user.phone,
          money: dt.money,
          message: dt.message,
          status: "Pending",
        });
        await history.save();
        return res.status(200).json({
          code: 200,
          message: "Giao dịch thành công, chờ admin xử lý",
        });
      }

      // Sender
      if (dt.fee_payer === "Sender") {
        let curr_money = sender_user.money - dt.money - transfer_fee;
        //update sender money
        await User.findOneAndUpdate(
          { username: sender_user.username },
          { money: curr_money }
        );
        //update receiver money
        await User.findOneAndUpdate(
          { username: receiver_user.username },
          { money: receiver_user.money + dt.money }
        );
      }

      //Receiver
      if (dt.fee_payer === "Receiver") {
        let curr_money = sender_user.money - dt.money;
        //update sender money
        await User.findOneAndUpdate(
          { username: sender_user.username },
          { money: curr_money }
        );
        //update receiver money
        await User.findOneAndUpdate(
          { username: receiver_user.username },
          { money: receiver_user.money + dt.money - transfer_fee }
        );
      }

      // add sender history
      const sender_history = new History({
        username: sender_user.username,
        type: "Transfer",
        receiver_phone_number: receiver_user.phone,
        money: dt.money,
        message: dt.message,
        status: "Success",
      });
      await sender_history.save();

      // add receiver history
      const receiver_history = new History({
        username: receiver_user.username,
        type: "Transfer",
        receiver_phone_number: sender_user.phone,
        money: dt.money,
        message: dt.message,
        status: "Success",
      });
      await receiver_history.save();

      return res
        .status(200)
        .json({ code: 200, message: "Chuyển tiền thành công" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ code: 400, message: "lỗi" });
    }
  }

  async phonecards(req, res) {
    const user = await User.findOne({ username: req.user.username }).exec();
    try {
      let { nhacungcap, menhgia, soluong } = req.body;
      let curr_money = user.money;
      let total_monney = menhgia * soluong;

      if (total_monney > curr_money) {
        return res
          .status(400)
          .json({ code: 400, message: "Số tiền trong tài khoản không đủ" });
      }

      if (total_monney < curr_money) {
        let newMoney = curr_money - total_monney;
        try {
          await User.findByIdAndUpdate(user.id, { money: newMoney });
        } catch (error) {
          console.log(error);
        }
      }

      let id_card = [];
      let code;
      if (soluong > 5) {
        return res
          .status(400)
          .json({ code: 400, message: "Chỉ được mua tối đa 5 thẻ" });
      }
      if (soluong < 1) {
        return res
          .status(400)
          .json({ code: 400, message: "Số lượng thẻ không hợp lệ" });
      }
      switch (nhacungcap) {
        case "Viettel": {
          if (soluong > 0) {
            for (let i = 0; i < soluong; i++) {
              let random_card = Math.floor(Math.random() * 100001);
              code = "11111" + random_card;
              id_card.push(code);
            }
          }
          break;
        }
        case "Mobifone": {
          if (soluong > 0) {
            for (let i = 0; i < soluong; i++) {
              let random_card = Math.floor(Math.random() * 100001);
              code = "22222" + random_card;
              id_card.push(code);
            }
          }
          break;
        }
        case "Vinaphone": {
          if (soluong > 0) {
            for (let i = 0; i < soluong; i++) {
              let random_card = Math.floor(Math.random() * 100001);
              code = "33333" + random_card;
              id_card.push(code);
            }
          }
          break;
        }
        default: {
          return res
            .status(400)
            .json({ code: 400, message: "Nhà cung cấp không hợp lệ" });
        }
      }
      await helper.CreateBuyCardHistory(
        user,
        nhacungcap,
        menhgia,
        soluong,
        total_monney,
        id_card
      );
      return res.status(200).json({
        code: 200,
        message: "Mua thẻ thành công",
        data: { nhacungcap, menhgia, soluong, total_monney, id_card },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ code: 400, message: "Lỗi" });
    }
  }
}

module.exports = new WalletController();
