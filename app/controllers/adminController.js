const blacklistModel = require("../models/blacklist.model");
const userModel = require("../models/user.model");
const historyModel = require("../models/history.model");

class AdminController {
  async index(req, res, next) {
    const userWait = JSON.parse(
      JSON.stringify(
        await userModel.find({
          status: { $in: ["Chờ xác minh", "Chờ cập nhật"] },
        })
      )
    ).sort((a, b) => (a.createdAt < b.createdAt || a.cmnd ? 1 : -1));

    const userAct = JSON.parse(
      JSON.stringify(await userModel.find({ status: "Đã xác minh" }))
    ).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    const userDis = JSON.parse(
      JSON.stringify(await userModel.find({ status: "Đã vô hiệu hoá" }))
    ).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    const userLock = JSON.parse(
      JSON.stringify(
        await userModel.find({ status: "Đang bị khóa vô thời hạn" })
      )
    );

    const deals = JSON.parse(
      JSON.stringify(await historyModel.find({ status: "Pending" }))
    )
      .filter((elem) => elem.money >= 5000000)
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    res.render("admin/admin", {
      title: "Admin",
      userWait,
      userAct,
      userDis,
      userLock,
      deals,
    });
  }

  async XacMinh(req, res, next) {
    const { username } = req.body;
    try {
      await userModel
        .findOneAndUpdate({ username }, { status: "Đã xác minh" })
        .exec();
      return res.status(200).json({ message: "Xác minh thành công" });
    } catch (error) {
      return res.status(400).json({ message: "Xác minh thất bại" });
    }
  }

  async BoSung(req, res, next) {
    const { username } = req.body;
    try {
      await userModel
        .findOneAndUpdate({ username }, { status: "Chờ cập nhật" })
        .exec();
      return res.status(200).json({ message: "Gửi yêu cầu thành công" });
    } catch (error) {
      return res.status(400).json({ message: "Gửi yêu cầu thất bại" });
    }
  }

  async Huy(req, res, next) {
    const { username } = req.body;
    try {
      await userModel
        .findOneAndUpdate({ username }, { status: "Đã vô hiệu hoá" })
        .exec();
      return res.status(200).json({ message: "Vô hiệu hoá thành công" });
    } catch (error) {
      return res.status(400).json({ message: "Vô hiệu hoá thất bại" });
    }
  }

  async MoKhoa(req, res, next) {
    const { username } = req.body;
    try {
      await userModel
        .findOneAndUpdate({ username }, { status: "Chờ xác minh", unusual: 0 })
        .exec();
      await blacklistModel.deleteOne({ username }).exec();
      return res.status(200).json({ message: "Mở khoá thành công" });
    } catch (error) {
      return res.status(400).json({ message: "Mở khoá thất bại" });
    }
  }

  async DongY(req, res, next) {
    const { _id, username } = req.body;
    console.log(req.body);
    const user = await userModel.findOne({ username }).exec();
    const gd = await historyModel.findOne({ _id }).exec();
    console.log(user.money, gd.money);
    if (user.money < gd.money) {
      return res
        .status(400)
        .json({ message: "User không đủ tiền để giao dịch" });
    }
    try {
      await historyModel
        .findOneAndUpdate({ _id }, { status: "Success" })
        .exec();
      await userModel
        .findOneAndUpdate({ username }, { money: user.money - gd.money * 1.05 })
        .exec();
      return res.status(200).json({ message: "Đồng ý thành công" });
    } catch (error) {
      return res.status(400).json({ message: "Đồng ý thất bại" });
    }
  }

  async TuChoi(req, res, next) {
    const { _id } = req.body;
    try {
      await historyModel.findOneAndUpdate({ _id }, { status: "Reject" }).exec();
      return res.status(200).json({ message: "Từ chối thành công" });
    } catch (error) {
      return res.status(400).json({ message: "Từ chối thất bại" });
    }
  }
}

module.exports = new AdminController();
