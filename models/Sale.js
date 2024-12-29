const { DataTypes } = require("sequelize");
const db = require("../config/db.js");

const Sale = db.define("sales", {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  saleDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Por defecto, no está eliminado
  },
});

module.exports = Sale;
