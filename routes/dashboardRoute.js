const express = require("express");
const { getDashboardStats } = require("../controllers/dashboardController.js");
const authenticateUser = require("../middlewares/authenticateUser.js");
const router = express.Router();

router.get("/", authenticateUser, getDashboardStats);

module.exports = router;
