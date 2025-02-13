require("dotenv").config();

module.exports = {
  development: {
    username: process.env.BD_USER,
    password: process.env.BD_PASSWORD ?? "",
    database: process.env.BD_NOMBRE,
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
  },
};
