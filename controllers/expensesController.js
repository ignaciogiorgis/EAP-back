import { check, validationResult } from "express-validator";
import Expense from "../models/Expense.js";

const createExpense = async (req, res) => {
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
  const { userId } = req.user;

  const expense = await Expense.create({
    name,
    value,
    description,
    date,
    usuarioId: userId,
  });

  return res.status(201).json({
    messege: "Successfully created expense",
    expense: {
      id: expense.id,
      name: expense.name,
      value: expense.value,
      description: expense.description,
      date: expense.date,
    },
  });
};

const showExpenses = async (req, res) => {
  const { userId } = req.user;
  try {
    const expenses = await Expense.findAll({
      where: {
        isDeleted: false,
        usuarioId: userId,
      },
    });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error obtaining expenses:", error);
    res
      .status(500)
      .json({ error: "There was a problem obtaining the expenses" });
  }
};

const editExpense = async (req, res) => {
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
    return res.status(400).json({ error: result.array() });
  }

  const { id } = req.params;
  const { name, value, description, date } = req.body;

  try {
    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ error: "Expense not Found" });
    }

    await expense.update({
      name: name ?? expense.name,
      value: value ?? expense.value,
      description: description ?? expense.description,
      date: date ?? expense.date,
    });

    return res.status(200).json({
      message: "Expense updated correctly",
      expense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return res
      .status(500)
      .json({ error: "There was a problem updating the expense" });
  }
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    // Busca el gasto por su ID
    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Actualiza el campo `isDeleted` a true
    await expense.update({ isDeleted: true });

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export { createExpense, showExpenses, editExpense, deleteExpense };
