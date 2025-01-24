const express = require("express");
const {
  createSale,
  showSales,
  editSale,
} = require("../controllers/salesController.js");
const authenticateUser = require("../middlewares/authenticateUser.js");

const router = express.Router();

router.post("/sale", authenticateUser, createSale);
router.get("/sale", authenticateUser, showSales);
router.put("/sale", authenticateUser, editSale);

module.exports = router;
