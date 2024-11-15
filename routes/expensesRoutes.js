import express from "express";
import {
  createExpense,
  showExpenses,
} from "../controllers/expensesController.js";

const router = express.Router();

router.post("/expense", createExpense);
router.get("/expense", showExpenses);
export default router;
