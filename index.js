import express from "express";
import usuarioRoute from "./routes/usuariosRoutes.js";
import expenseRoute from "./routes/expensesRoutes.js";
import productRoute from "./routes/productsRoute.js";
import cors from "cors";
import db from "./config/db.js";

// Crear la aplicación de Express
const app = express();

// Habilitar lectura de formularios (para rutas POST)
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Conectar a la base de datos
try {
  await db.authenticate();
  await db.sync({ alter: true });
  console.log("Conexión establecida exitosamente.");
} catch (error) {
  console.error("No se pudo conectar a la base de datos:", error);
}
app.use(express.json());
// Servir archivos estáticos (imágenes, CSS, etc.) si es necesario
app.use(express.static("public"));

// Definir las rutas (API)
app.use("/auth", usuarioRoute);
app.use("/dashboard", expenseRoute);
app.use("/dashboard", productRoute);
// Definir el puerto del servidor
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`El servidor funciona en el puerto ${port}`);
});
