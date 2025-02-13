const User = require("./User.js");
const Expense = require("./Expense.js");
const Product = require("./Product.js");
const Client = require("./Client.js");
const Sale = require("./Sale.js");

// Relación User -> Client
User.hasMany(Client, { foreignKey: "usuarioId", as: "clients" });
Client.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });

// Relación User -> Expense
User.hasMany(Expense, { foreignKey: "usuarioId", as: "expenses" });
Expense.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });

// Relación User -> Product
User.hasMany(Product, { foreignKey: "usuarioId", as: "products" });
Product.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });

// Relación Product -> Sale
Product.hasMany(Sale, { foreignKey: "productId", as: "sales" });
Sale.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Relación Client -> Sale
Client.hasMany(Sale, { foreignKey: "clientId", as: "sales" });
Sale.belongsTo(Client, { foreignKey: "clientId", as: "client" });

// Relación User -> Sale
User.hasMany(Sale, { foreignKey: "usuarioId", as: "sales" });
Sale.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });

module.exports = { User, Expense, Product, Client, Sale };
