import express from "express";
import {
  createExpense,
  showExpenses,
  editExpense,
  deleteExpense,
} from "../controllers/expensesController.js";
import authenticateUser from "../middlewares/authenticateUser.js";

const router = express.Router();

router.post("/expense", authenticateUser, createExpense);
router.get("/expense", authenticateUser, showExpenses);
router.put("/expense/:id", authenticateUser, editExpense);
router.patch("/expense/:id", authenticateUser, deleteExpense);
export default router;
