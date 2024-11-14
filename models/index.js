import Usuario from "./Usuario.js";
import Expense from "./Expense.js";

Usuario.hasMany(Expense, { foreignKey: "usuarioId", as: "expenses" });
Expense.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });

export { Usuario, Expense };
