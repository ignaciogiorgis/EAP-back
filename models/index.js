const User = require("./User.js");
const Expense = require("./Expense.js");
const Product = require("./Product.js");
const Client = require("./Client.js");

User.hasMany(Client, { foreignKey: "usuarioId", as: "client" });
Client.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });

User.hasMany(Expense, { foreignKey: "usuarioId", as: "expenses" });
Expense.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });

User.hasMany(Product, { foreignKey: "usuarioId", as: "products" });
Product.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });

module.exports = { User, Expense, Product, Client };
