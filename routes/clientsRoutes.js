const express = require("express");
const { createClient } = require("../controllers/clientsController.js");
const authenticateUser = require("../middlewares/authenticateUser.js");

const router = express.Router();

router.post("/client", authenticateUser, createClient);

module.exports = router;
