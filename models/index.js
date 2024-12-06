import Usuario from "./Usuario.js";
import Expense from "./Expense.js";
import Product from "./Product.js";

Usuario.hasMany(Expense, { foreignKey: "usuarioId", as: "expenses" });
Expense.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });
Usuario.hasMany(Product, { foreignKey: "usuarioId", as: "products" });
Product.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });

export { Usuario, Expense, Product };
