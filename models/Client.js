const { DataTypes } = require("sequelize");
const db = require("../config/db.js");

const Client = db.define("clients", {
  firstName: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  dni: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  phone: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  usuarioId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
});

module.exports = Client;
