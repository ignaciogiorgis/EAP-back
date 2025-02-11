const express = require("express");
const {
  register,
  confirmRegister,
  resetPassword,
  verificationToken,
  newPassword,
  authUser,
  logout,
  uploadPictureProfile,
  showProfile,
} = require("../controllers/usersController.js");
const upload = require("../middlewares/multer"); // Middleware para manejar imágenes
const authenticateUser = require("../middlewares/authenticateUser.js");
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

router.get("/profile", authenticateUser, showProfile);
router.post(
  "/upload-profile",
  authenticateUser,
  upload.single("file"),
  uploadPictureProfile
);

module.exports = router;
