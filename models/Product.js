import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Product = db.define("products", {
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER(),
    allowNull: false,
  },
  cost: {
    type: DataTypes.FLOAT(),
    allowNull: false,
  },
  profit: {
    type: DataTypes.FLOAT(),
    allowNull: false,
  },
});

export default Product;
