import { check, validationResult } from "express-validator";
import Expense from "../models/Expense.js";
const createProduct = async (req, res) => {
  await check("name")
    .notEmpty()
    .withMessage("The name cannot be empty")
    .run(req);
  await check("value")
    .notEmpty()
    .isInt()
    .withMessage("The value cannot be empty ")
    .run(req);
  await check("description")
    .notEmpty()
    .withMessage("The description cannot be empty")
    .run(req);
  await check("date")
    .notEmpty()
    .isDate()
    .withMessage("The date cannot be empty")
    .run(req);

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      error: result.array(),
      expense: {
        name: req.body.name,
        value: req.body.value,
        description: req.body.description,
        date: req.body.date,
      },
    });
  }

  const { name, value, description, date } = req.body;

  const expense = await Expense.create({
    name,
    value,
    description,
    date,
  });

  return res.status(201).json({
    messege: "Successfully created expense",
    expense: {
      id: expense.id,
      name: expense.name,
      value: expense.value,
      description: expense.description,
    },
  });
};
