import express from "express";
import {
  register,
  confirmRegister,
  resetPassword,
  verificationToken,
  newPassword,
  authUser,
  logout,
} from "../controllers/usersController.js";

const router = express.Router();

// Ruta para iniciar sesión (POST para autenticación)
router.post("/login", authUser);
router.post("/logout", logout);

// Rutas para creación de cuenta
router.post("/register", register); // Registrar un usuario
router.get("/confirm/:token", confirmRegister); // Confirmar registro con el token

// Rutas para recuperación de contraseña
router.post("/recover", resetPassword); // Enviar instrucciones de recuperación
router.get("/recover/:token", verificationToken); // Comprobar token para reset
router.post("/recover/:token", newPassword); // Actualizar nueva contraseña

export default router;
