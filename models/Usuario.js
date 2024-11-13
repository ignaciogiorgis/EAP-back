import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Usuario = db.define(
  "usuarios",
  {
    nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
    },
    confirm: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    scopes: {
      eliminarPassword: {
        attributes: {
          exclude: ["password", "token", "confirm", "createdAt", "updatedAt"],
        },
      },
    },
  }
);

export default Usuario;
