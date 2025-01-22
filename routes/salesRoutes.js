const express = require("express");
const { createSale, showSales } = require("../controllers/salesController.js");
const authenticateUser = require("../middlewares/authenticateUser.js");

const router = express.Router();

router.post("/sale", authenticateUser, createSale);
router.get("/sale", authenticateUser, showSales);

module.exports = router;
