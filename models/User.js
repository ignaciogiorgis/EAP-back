import { DataTypes } from "sequelize";
import db from "../config/db.js";

const User = db.define(
  "users",
  {
    name: {
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
      daletePassword: {
        attributes: {
          exclude: ["password", "token", "confirm", "createdAt", "updatedAt"],
        },
      },
    },
  }
);

export default User;
