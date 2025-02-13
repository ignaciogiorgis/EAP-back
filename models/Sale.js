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
  profit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cost: {
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
    defaultValue: false, 
  },
  productId: {
    type: DataTypes.INTEGER, 
    references: {
      model: "products", 
      key: "id",
    },
  },
  clientId: {
    type: DataTypes.INTEGER,
    references: {
      model: "clients", 
      key: "id",
    },
  },
  usuarioId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
});

module.exports = Sale;
