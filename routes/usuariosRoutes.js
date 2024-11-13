import express from "express";
import {
  register,
  confirmRegister,
  resetPassword,
  comprobationToken,
  newPassword,
  authUser,
  logout,
} from "../controllers/usuariosController.js";

const router = express.Router();

// Ruta para iniciar sesión (POST para autenticación)
router.post("/login", authUser);
router.post("/logout", logout);

// Rutas para creación de cuenta
router.post("/register", register); // Registrar un usuario
router.get("/confirm/:token", confirmRegister); // Confirmar registro con el token

// Rutas para recuperación de contraseña
router.post("/recover", resetPassword); // Enviar instrucciones de recuperación
router.get("/recover/:token", comprobationToken); // Comprobar token para reset
router.post("/recover/:token", newPassword); // Actualizar nueva contraseña

export default router;
