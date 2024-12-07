const { check, validationResult } = require("express-validator");
const Product = require("../models/Product.js");

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
  const { userId } = req.user;

  const product = await Product.create({
    name,
    quantity,
    cost,
    profit,
    usuarioId: userId,
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

const showProducts = async (req, res) => {
  const { userId } = req.user;
  try {
    const products = await Product.findAll({
      where: {
        isDeleted: false,
        usuarioId: userId,
      },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error obtaining products:", error);
    res
      .status(500)
      .json({ error: "There was a problem obtaining the products" });
  }
};

const editProduct = async (req, res) => {
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
    return res.status(400).json({ error: result.array() });
  }

  const { id } = req.params;
  const { name, quantity, cost, profit } = req.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Product not Found" });
    }
    if (Number(product?.dataValues?.usuarioId) !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to edit this Product" });
    }

    await product.update({
      name: name ?? product.name,
      quantity: quantity ?? product.quantity,
      cost: cost ?? product.cost,
      profit: profit ?? product.profit,
    });

    return res.status(200).json({
      message: "Product updated correctly",
      product,
    });
  } catch (error) {
    console.error("Error updating Product:", error);
    return res
      .status(500)
      .json({ error: "There was a problem updating the Product" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Busca el gasto por su ID
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (Number(product?.dataValues?.usuarioId) !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this product" });
    }

    // Actualiza el campo `isDeleted` a true
    await product.update({ isDeleted: true });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { createProduct, showProducts, editProduct, deleteProduct };
