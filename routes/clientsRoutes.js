const express = require("express");
const {
  createClient,
  showClients,
  editClient,
  deleteClient,
} = require("../controllers/clientsController.js");
const authenticateUser = require("../middlewares/authenticateUser.js");

const router = express.Router();

router.post("/client", authenticateUser, createClient);
router.get("/client", authenticateUser, showClients);
router.put("/client/:id", authenticateUser, editClient);
router.patch("/client/:id", authenticateUser, deleteClient);

module.exports = router;
