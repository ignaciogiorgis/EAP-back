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

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "https://eap-front.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  console.log(
    `Petición recibida: ${req.method} ${req.url} desde ${req.headers.origin}`
  );
  next();
});

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

    const port = process.env.PORT || 8080;
    app.listen(port, "0.0.0.0", () => {
      console.log(`El servidor funciona en el puerto ${port}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
};

startServer();
