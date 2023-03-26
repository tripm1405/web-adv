const express = require("express");
const path = require("path");
const cors = require("cors");
const logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");

require("dotenv").config();

const app = express();
//Require Router
const adminRoutes = require("./app/routes/admin.router");
const userRoutes = require("./app/routes/user.router");
const accountRoutes = require("./app/routes/account.router");
const walletRoutes = require("./app/routes/wallet.router");

// Require Middlewares
const auth = require("./app/middlewares/auth");

// Middlewares
app.use(cors());
app.use(logger(":method :url :status"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app/views"));
app.use(cookieParser(process.env.SIGN_COOKIE));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
// Authorization user
app.use(auth.userAuth);

//Handle Router
accountRoutes(app);
userRoutes(app);
walletRoutes(app);
adminRoutes(app);

// Handle Error
app.use((req, res) => {
  res.render("error/404.ejs", { title: "Error", error: " 404 Error" });
});
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
