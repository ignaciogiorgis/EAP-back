const express = require("express");
const {} = require("../controllers/salesController.js");
const authenticateUser = require("../middlewares/authenticateUser.js");

const router = express.Router();

router.post("/sale", authenticateUser);

module.exports = router;
