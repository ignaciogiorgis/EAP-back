const { Sequelize } = require("sequelize");

// No necesitamos dotenv en Railway, las variables ya están en process.env
// dotenv.config({ path: ".env" }); // Comentá esta línea o sacala

const db = new Sequelize(
  process.env.BD_NOMBRE,
  process.env.BD_USER,
  process.env.BD_PASSWORD || "", // Usamos || en vez de ?? por compatibilidad
  {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT || "3306",
    dialect: "mysql",
    define: {
      timestamps: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // Agregamos esto para debug en despliegue
    logging: console.log,
  }
);

console.log("Configuración de la base de datos:");
console.log({
  database: process.env.BD_NOMBRE,
  user: process.env.BD_USER,
  password: process.env.BD_PASSWORD,
  host: process.env.BD_HOST,
  port: process.env.BD_PORT || "3306",
});

async function testConnection() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    console.error("Detailed error:", error);
  }
}

testConnection();

module.exports = db;
