const adminController = require("../controllers/adminController");

function adminRoutes(app) {
  app.get("/admin", adminController.index);
  // Xac minh
  app.post("/admin/xac-minh", adminController.XacMinh);
  // Bo sung
  app.post("/admin/bo-sung", adminController.BoSung);
  // Huy
  app.post("/admin/huy", adminController.Huy);
  // Mo Khoa
  app.post("/admin/mo-khoa", adminController.MoKhoa);
  // Dong y
  app.post("/admin/dong-y", adminController.DongY);
  // Tu choi
  app.post("/admin/tu-choi", adminController.TuChoi);
}

module.exports = adminRoutes;
