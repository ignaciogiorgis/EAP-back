const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Client = require("../models/Client");

const createSale = async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { productName, clientName, quantity, total, paid, saleDate } =
      req.body;
    // Buscar el producto por nombre
    const product = await Product.findOne({ where: { name: productName } });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verificar si hay suficiente stock
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Restar el stock del producto
    await product.update({ quantity: product.quantity - quantity });

    // Crear la venta
    const sale = await Sale.create({
      productName, // Nombre del producto enviado desde el frontend
      clientName, // Nombre del cliente enviado desde el frontend
      quantity,
      price: total / quantity, // Precio unitario calculado
      total, // Total enviado desde el frontend
      paid, // Estado del pago
      saleDate: new Date(saleDate), // Convertir la fecha a un objeto Date
      productId: product.id,
    });
    // Responder con los datos de la venta
    res.status(201).json({
      sale,
      message: "Sale created successfully",
    });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const showSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      where: {
        isDeleted: false, // Solo ventas que no están eliminadas
      },
    });
    console.log("sales", sales);
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error obtaining sales:", error);
    res.status(500).json({ error: "There was a problem obtaining the sales" });
  }
};

module.exports = { createSale, showSales };
