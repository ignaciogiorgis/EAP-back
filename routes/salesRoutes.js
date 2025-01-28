const express = require("express");
const {
  createSale,
  showSales,
  editSale,
  deleteSale,
} = require("../controllers/salesController.js");
const authenticateUser = require("../middlewares/authenticateUser.js");

const router = express.Router();

router.post("/sale", authenticateUser, createSale);
router.get("/sale", authenticateUser, showSales);
router.put("/sale/:id", authenticateUser, editSale);
router.patch("/sale/:id", authenticateUser, deleteSale);

module.exports = router;
