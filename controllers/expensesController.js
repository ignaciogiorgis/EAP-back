import { check, validationResult } from "express-validator";
import Expense from "../models/Expense.js";

const createExpense = async (req, res) => {
  await check("name")
    .notEmpty()
    .withMessage("El nombre no puede ir vacio")
    .run(req);
  await check("value")
    .notEmpty()
    .isInt()
    .withMessage("El valor no puede ir vacio ")
    .run(req);
  await check("description")
    .notEmpty()
    .withMessage("La descripcion no puede ir vacia")
    .run(req);
  await check("date")
    .notEmpty()
    .isDate()
    .withMessage("La descripcion no puede ir vacia")
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
    messege: "Gasto creado correctamente",
    expense: {
      id: expense.id,
      name: expense.name,
      value: expense.value,
      description: expense.description,
    },
  });
};

export { createExpense };
