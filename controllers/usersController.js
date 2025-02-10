const { check, validationResult } = require("express-validator");
const User = require("../models/User.js");
const { generarId, generarJWT } = require("../helpers/tokens.js");
const { emailRegister, emailRecover } = require("../helpers/emails.js");
const bcrypt = require("bcrypt");
const { uploadImage } = require("../helpers/cloudinary");
const fs = require("fs");

// Autenticación del user
const authUser = async (req, res) => {
  await check("email").isEmail().withMessage("Email is required").run(req);
  await check("password")
    .notEmpty()
    .withMessage("The password is required")
    .run(req);

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      error: result.array(),
    });
  }

  const { email, password } = req.body;

  // Verificar si el user existe
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({
      error: "The user does not exist",
    });
  }

  // Verificar si el user está confirmado
  if (!user.confirm) {
    return res.status(403).json({
      error: "The user is not confirmed",
    });
  }

  const passwordCorrect = await bcrypt.compare(password, user.password);
  if (!passwordCorrect) {
    return res.status(403).json({ error: "Incorrect password" });
  }

  // Generar JWT y devolverlo
  const tokenJWT = generarJWT({ id: user.id, name: user.name });

  return res.status(200).json({
    message: "Successful authentication",
    token: tokenJWT,
    user: { id: user.id, name: user.name },
  });
};

// Registro del user
const register = async (req, res) => {
  // Validación
  await check("name")
    .notEmpty()
    .withMessage("The name cannot be empty")
    .run(req);
  await check("email")
    .isEmail()
    .withMessage("The email is not correct")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("The password must be at least 6 characters")
    .run(req);
  await check("repetir_password")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Passwords are not the same");
      return true;
    })
    .run(req);

  const result = validationResult(req);

  // Verificar si hay error
  if (!result.isEmpty()) {
    return res.status(400).json({
      error: result.array(),
      user: { name: req.body.name, email: req.body.email },
    });
  }

  const { name, email, password } = req.body;

  // Verificar si el user ya está registrado
  const userExist = await User.findOne({ where: { email } });
  if (userExist) {
    return res.status(400).json({
      error: "The user is already registered",
      user: { name, email },
    });
  }

  // Crear nuevo user
  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    token: generarId(),
  });

  // Enviar email de confirmación
  emailRegister({
    name: user.name,
    email: user.email,
    token: user.token,
  });

  return res.status(201).json({
    message: "Account created successfully. Verify your email",
    user: { id: user.id, name: user.name, email: user.email },
  });
};

// Confirmación de registro
const confirmRegister = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ where: { token } });
    if (!user) {
      return res.status(400).json({
        message: "An error occurred while confirming your account",
        error: true,
      });
    }

    // Confirmar cuenta
    user.token = null;
    user.confirm = true;

    await user.save(); // Guarda los cambios

    return res.status(200).json({
      message: "Successfully confirmed account",
      error: false,
    });
  } catch (error) {
    console.error("Error confirming registration:", error);
    return res.status(500).json({
      message: "Internal error confirming account",
      error: true,
    });
  }
};

// Reseteo de contraseña
const resetPassword = async (req, res) => {
  // Validación del email
  await check("email")
    .isEmail()
    .withMessage("The email is not correct")
    .run(req);
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      error: result.array(),
    });
  }

  const { email } = req.body;

  // Verificar si el user existe
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({
      error: "The email does not belong to any user",
    });
  }

  // Generar token y enviar email
  user.token = generarId();
  await user.save();

  emailRecover({
    email: user.email,
    name: user.name,
    token: user.token,
  });

  return res.status(200).json({
    message: "We have sent an email with instructions",
  });
};

// Comprobación del token para resetear contraseña
const verificationToken = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ where: { token } });
  if (!user) {
    return res.status(400).json({
      message: "An error occurred while validating your information",
      error: true,
    });
  }

  return res.status(200).json({
    message: "Valid token, proceed to change the password",
  });
};

// Actualizar la contraseña
const newPassword = async (req, res) => {
  await check("password")
    .isLength({ min: 6 })
    .withMessage("The password must be at least 6 characters")
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      error: result.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ where: { token } });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.token = null;

  await user.save();

  return res.status(200).json({
    message: "Your password was successfully reset",
  });
};

const logout = (req, res) => {
  res.clearCookie("session_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logout successful" });
};

const uploadPictureProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se ha subido ninguna imagen" });
    }

    const imageUrl = await uploadImage(req.file.path);

    fs.unlinkSync(req.file.path);

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "user no encontrado" });
    }

    user.picture = imageUrl;
    await user.save();

    return res.json({
      message: "Imagen subida con éxito",
      url: imageUrl,
    });
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    return res.status(500).json({ error: "Error al subir la imagen" });
  }
};

module.exports = {
  register,
  confirmRegister,
  resetPassword,
  verificationToken,
  newPassword,
  authUser,
  logout,
  uploadPictureProfile,
};
