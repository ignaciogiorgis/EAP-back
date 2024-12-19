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
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [7, 10],
    },
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [10, 15],
    },
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
