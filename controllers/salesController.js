const { Sale } = require("../models/Sale");
const { Product } = require("../models/Product");
const { Client } = require("../models/Client");

const createSale = async (req, res) => {
  try {
    const { productId, clientId, quantity } = req.body;

    // Verificar existencia del producto
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verificar stock disponible
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Verificar existencia del cliente
    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Calcular precio y total
    const price = product.profit + product.cost;
    const total = price * quantity;

    // Crear la venta
    const sale = await Sale.create({
      productId,
      clientId,
      quantity,
      price,
      total,
      paid: false, // Inicialmente no pagado
      saleDate: new Date(),
    });

    // Reducir stock del producto
    await product.update({ stock: product.quantity - quantity });

    // Responder con datos de la venta y cliente
    res.status(201).json({
      sale,
      client: { name: client.name, phone: client.phone, email: client.email },
    });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createSale };
