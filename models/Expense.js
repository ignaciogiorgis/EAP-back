const { DataTypes } = require("sequelize");
const db = require("../config/db.js");

const Expense = db.define("expenses", {
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  value: {
    type: DataTypes.INTEGER(),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Por defecto, no está eliminado
  },
  usuarioId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
});

module.exports = Expense;
