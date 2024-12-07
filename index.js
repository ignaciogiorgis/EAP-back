const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/usersRoutes.js");
const expenseRoute = require("./routes/expensesRoutes.js");
const productRoute = require("./routes/productsRoute.js");
const db = require("./config/db.js");

// Crear la aplicación de Express
const app = express();

// Habilitar lectura de formularios (para rutas POST)
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Asegúrate de incluir 'Authorization'
  })
);

app.use(express.json());
// Servir archivos estáticos (imágenes, CSS, etc.) si es necesario
app.use(express.static("public"));

// Definir las rutas (API)
app.use("/auth", userRoute);
app.use("/dashboard", expenseRoute);
app.use("/dashboard", productRoute);

// Función para iniciar la conexión a la base de datos y el servidor
const startServer = async () => {
  try {
    await db.authenticate();
    await db.sync({ alter: true });
    console.log("Conexión establecida exitosamente.");

    // Definir el puerto del servidor
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`El servidor funciona en el puerto ${port}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
};

// Iniciar el servidor
startServer();
