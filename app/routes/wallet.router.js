const walletController = require("../controllers/walletController");
const historyController = require("../controllers/historyController");

const helper = require("../helper/helper");

function walletRoutes(app) {
  // app.get("/wallet/phonecardDetails", historyController.cardDetails);

  // Home
  app.get("/", async (req, res) => {
    const user = await helper.getUserInfo(req.user);
    const locals = { title: "Trang chủ", user: user };
    res.render("wallet/home", locals);
  });
  // Deposit
  app.post("/wallet/deposit", walletController.deposit);
  // Withdraw
  app.post("/wallet/withdraw", walletController.withdraw);
  // Transfer
  app.post("/wallet/transfer", walletController.transfer);
  // OTP
  app.post("/wallet/otp", walletController.verifyOTP);
  // Phone Card
  app.post("/wallet/phonecards", walletController.phonecards);
  // History
  app.get("/history", historyController.index);
  // Account
  app.get("/account", async (req, res) => {
    const user = await helper.getUserInfo(req.user);
    const locals = { title: "Tài khoản", user: user };
    res.render("wallet/account", locals);
  });
}

module.exports = walletRoutes;
