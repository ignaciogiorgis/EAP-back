const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const db = new Sequelize(
  process.env.BD_NOMBRE,
  process.env.BD_USER,
  process.env.BD_PASSWORD ?? "",
  {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT ?? "3306", // Usa la variable BD_PORT si existe
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
  }
);

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
