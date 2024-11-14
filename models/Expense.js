import { DataTypes } from "sequelize";
import db from "../config/db.js";

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
    type: DataTypes.DATE(),
    allowNull: false,
  },
});

export default Expense;
