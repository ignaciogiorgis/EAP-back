const { DataTypes } = require("sequelize");
const db = require("../config/db.js");

const Sale = db.define("sales", {
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clientName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
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
  productId: {
    type: DataTypes.INTEGER, // Clave foránea que conecta con el modelo Product
    references: {
      model: "products", // Nombre de la tabla en la base de datos
      key: "id",
    },
  },
});

module.exports = Sale;
