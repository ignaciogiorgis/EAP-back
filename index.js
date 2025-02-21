const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/usersRoutes.js");
const expenseRoute = require("./routes/expensesRoutes.js");
const productRoute = require("./routes/productsRoute.js");
const clientRoute = require("./routes/clientsRoutes.js");
const saleRoute = require("./routes/salesRoutes.js");
const dashboardRoute = require("./routes/dashboardRoute.js");
const db = require("./config/db.js");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.static("public"));

app.use("/auth", userRoute);
app.use("/dashboard", dashboardRoute);
app.use("/dashboard", expenseRoute);
app.use("/dashboard", productRoute);
app.use("/dashboard", clientRoute);
app.use("/dashboard", saleRoute);

const startServer = async () => {
  try {
    await db.authenticate();
    await db.sync();
    console.log("Conexión establecida exitosamente.");

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`El servidor funciona en el puerto ${port}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
};

startServer();
