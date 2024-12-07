const express = require("express");
const {
  createExpense,
  showExpenses,
  editExpense,
  deleteExpense,
} = require("../controllers/expensesController.js");
const authenticateUser = require("../middlewares/authenticateUser.js");

const router = express.Router();

router.post("/expense", authenticateUser, createExpense);
router.get("/expense", authenticateUser, showExpenses);
router.put("/expense/:id", authenticateUser, editExpense);
router.patch("/expense/:id", authenticateUser, deleteExpense);

module.exports = router;
