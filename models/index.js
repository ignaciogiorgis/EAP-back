const Usuario = require("./Usuario.js");
const Expense = require("./Expense.js");
const Product = require("./Product.js");

Usuario.hasMany(Expense, { foreignKey: "usuarioId", as: "expenses" });
Expense.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });
Usuario.hasMany(Product, { foreignKey: "usuarioId", as: "products" });
Product.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });

module.exports = { Usuario, Expense, Product };
