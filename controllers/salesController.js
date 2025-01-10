const { Sale } = require("../models/Sale");
const { Product } = require("../models/Product");
const { Client } = require("../models/Client");

const createSale = async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { productName, clientName, quantity } = req.body;

    // Buscar el producto utilizando el nombre (asumiendo que tienes un método para ello)
    const product = await Product.findOne({ where: { name: productName } });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verificar stock disponible
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Buscar el cliente utilizando el nombre (asumiendo que tienes un método para ello)
    const client = await Client.findOne({ where: { name: clientName } });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Calcular precio y total
    const price = product.profit + product.cost;
    const total = price * quantity;

    // Crear la venta
    const sale = await Sale.create({
      productId: product.id, // Usar el ID del producto encontrado
      clientId: client.id, // Usar el ID del cliente encontrado
      quantity,
      price,
      total,
      paid: false, // Inicialmente no pagado
      saleDate: new Date(),
    });

    // Reducir stock del producto
    await product.update({ quantity: product.quantity - quantity });

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
