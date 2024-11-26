import { check, validationResult } from "express-validator";
import Product from "../models/Product.js";

const createProduct = async (req, res) => {
  await check("name")
    .notEmpty()
    .withMessage("The name cannot be empty")
    .run(req);
  await check("quantity")
    .notEmpty()
    .isFloat()
    .withMessage("The quantity cannot be empty ")
    .run(req);
  await check("cost")
    .notEmpty()
    .isFloat()
    .withMessage("The cost cannot be empty")
    .run(req);
  await check("profit")
    .notEmpty()
    .isFloat()
    .withMessage("The profit cannot be empty")
    .run(req);

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      error: result.array(),
      product: {
        name: req.body.name,
        quantity: req.body.quantity,
        cost: req.body.cost,
        profit: req.body.profit,
      },
    });
  }

  const { name, quantity, cost, profit } = req.body;

  const product = await Product.create({
    name,
    quantity,
    cost,
    profit,
  });

  return res.status(201).json({
    messege: "Successfully created product",
    product: {
      id: product.id,
      name: product.name,
      quantity: product.value,
      cost: product.description,
      profit: product.profit,
    },
  });
};

export { createProduct };
