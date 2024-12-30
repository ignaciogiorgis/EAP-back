const express = require("express");
const { createSale } = require("../controllers/salesController.js");
const authenticateUser = require("../middlewares/authenticateUser.js");

const router = express.Router();

router.post("/sale", authenticateUser, createSale);

module.exports = router;
