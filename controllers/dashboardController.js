const { Sale, Client, Product, Expense } = require("../models");
const { Op } = require("sequelize");

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

    const totalSales = await Sale.sum("total", {
      where: { saleDate: { [Op.between]: [firstDayOfMonth, lastDayOfMonth] } },
    });

    const totalCountSales = await Sale.count({
      where: { saleDate: { [Op.between]: [firstDayOfMonth, lastDayOfMonth] } },
    });

    res.json({
      totalExpenses: totalExpenses || 0,
      totalSales: totalSales || 0,
      totalCountSales: totalCountSales || 0,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getDashboardStats };
