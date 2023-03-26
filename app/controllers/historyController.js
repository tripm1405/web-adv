//Required models
const History = require("../models/history.model");

class HistoryController {
  index(req, res, next) {
    History.find({ username: req.user.username })
      .exec()
      .then((dt) => {
        //sort date ascending
        dt.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        const locals = { title: "Lịch sử giao dịch", data: dt };
        res.render("wallet/history", locals);
      })
      .catch(next);
  }

  details(req, res, next) {
    History.findOne({ username: req.user.username, _id: req.params.id }).then(
      (dt) => {
        if (dt) {
          res.render("wallet/transactionDetails", {
            title: "Transaction Details",
            data: JSON.parse(JSON.stringify(dt)),
          });
        }
        next();
      }
    );
  }

  cardDetails(req, res, next) {
    console.log(req.params.id);
    History.findOne({ username: req.user.username, _id: req.params.id }) //req.user.username, //req.params.id
      .then((dt) => {
        if (dt) {
          console.log(dt);
          return res.render("wallet/phonecardDetails", {
            title: "Phone card details",
            data: JSON.parse(JSON.stringify(dt)),
          });
        }
        next();
      });
  }
}

module.exports = new HistoryController();
