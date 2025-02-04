const Sale = require("../models/Sale");
const Product = require("../models/Product");

const createSale = async (req, res) => {
  try {
    const { productName, clientName, quantity, total, paid, saleDate } =
      req.body;
    const { userId } = req.user;
    const product = await Product.findOne({ where: { name: productName } });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    await product.update({ quantity: product.quantity - quantity });

    const sale = await Sale.create({
      productName,
      clientName,
      quantity,
      price: total / quantity,
      total,
      paid,
      saleDate: new Date(saleDate),
      productId: product.id,
      usuarioId: userId,
    });

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
  const { userId } = req.user;
  const { q } = req.query;

  try {
    const whereClause = {
      isDeleted: false,
      usuarioId: userId,
    };

    if (q) {
      whereClause[Op.or] = [{ clientName: { [Op.like]: `%${q}%` } }];
    }

    const sales = await Sale.findAll({
      where: whereClause,
    });

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error obtaining sales:", error);
    res.status(500).json({ error: "There was a problem obtaining the sales" });
  }
};

const editSale = async (req, res) => {
  const { id } = req.params;
  const { productName, clientName, quantity, total, paid, saleDate } = req.body;

  try {
    const sale = await Sale.findByPk(id);

    if (!sale) {
      return res.status(404).json({ error: "Sale not Found" });
    }
    if (Number(sale?.dataValues?.usuarioId) !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to edit this Product" });
    }

    await sale.update({
      productName: productName ?? sale.name,
      clientName: clientName ?? sale.clientName,
      quantity: quantity ?? sale.quantity,
      paid: paid ?? sale.paid,
      saleDate: saleDate ?? sale.saleDate,
    });

    return res.status(200).json({
      message: "Sale updated correctly",
      sale,
    });
  } catch (error) {
    console.error("Error updating Sale:", error);
    return res
      .status(500)
      .json({ error: "There was a problem updating the Sale" });
  }
};

const deleteSale = async (req, res) => {
  const { id } = req.params;

  try {
    const sale = await Sale.findByPk(id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    if (Number(sale?.dataValues?.usuarioId) !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this sale" });
    }

    await sale.update({ isDeleted: true });

    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { createSale, showSales, editSale, deleteSale };
