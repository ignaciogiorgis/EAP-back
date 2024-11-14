import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoute from "./routes/usuariosRoutes.js";
import expenseRoute from "./routes/expensesRoutes.js";
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

// Habilitar cookies
// app.use(cookieParser());

// app.use(csrf({ cookie: false }));

// Conectar a la base de datos
try {
  await db.authenticate();
  await db.sync();
  console.log("Conexión establecida exitosamente.");
} catch (error) {
  console.error("No se pudo conectar a la base de datos:", error);
}
app.use(express.json());
// Servir archivos estáticos (imágenes, CSS, etc.) si es necesario
app.use(express.static("public"));

// Definir las rutas (API)
app.use("/auth", usuarioRoute);
app.use("/dashboard", expenseRoute); // Rutas de autenticación

// Definir el puerto del servidor
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`El servidor funciona en el puerto ${port}`);
});
