import express from "express";
import { createExpense } from "../controllers/expensesController.js";

const router = express.Router();

router.post("/expenses", createExpense);

export default router;
