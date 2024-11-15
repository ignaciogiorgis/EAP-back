import express from "express";
import {
  createExpense,
  showExpenses,
  editExpense,
} from "../controllers/expensesController.js";

const router = express.Router();

router.post("/expense", createExpense);
router.get("/expense", showExpenses);
router.put("/expense/:id", editExpense);
export default router;
