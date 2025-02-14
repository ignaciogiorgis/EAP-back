const { Sale, Client, Product, Expense } = require("../models");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");

const getDashboardStats = async (req, res) => {
  try {
    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    );

    const totalExpenses = await Expense.sum("value", {
      where: { date: { [Op.between]: [firstDayOfMonth, lastDayOfMonth] } },
    });

    const totalSales = await Sale.findOne({
      attributes: [
        [
          Sequelize.fn("SUM", Sequelize.literal("profit * quantity")),
          "totalProfit",
        ],
      ],
      where: {
        saleDate: { [Op.between]: [firstDayOfMonth, lastDayOfMonth] },
      },
      raw: true,
    });

    const totalCountSales = await Sale.count({
      where: { saleDate: { [Op.between]: [firstDayOfMonth, lastDayOfMonth] } },
    });

    const totalDebt = await Sale.findOne({
      attributes: [[Sequelize.fn("SUM", Sequelize.col("total")), "totalDebt"]],
      where: {
        paid: false,
        saleDate: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth],
        },
      },
      raw: true,
    });

    const bestSellingProduct = await Sale.findOne({
      attributes: [
        "productId",
        [Sequelize.fn("SUM", Sequelize.col("sales.quantity")), "totalSold"],
      ],
      where: {
        saleDate: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth],
        },
      },
      group: ["sales.productId"],
      order: [[Sequelize.literal("totalSold"), "DESC"]],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["name"],
        },
      ],
      raw: true,
      nest: true,
    });

    const totalClients = await Client.count();

    res.json({
      totalExpenses: totalExpenses || 0,
      totalSales: totalSales?.totalProfit || 0,
      totalCountSales: totalCountSales || 0,
      totalDebt: totalDebt?.totalDebt || 0,
      bestSellingProduct: bestSellingProduct?.product?.name || "",
      totalClients: totalClients || 0,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getDashboardStats };
