import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarId, generarJWT } from "../helpers/tokens.js";
import { emailRegister, emailRecover } from "../helpers/emails.js";
import bcrypt from "bcrypt";

// Autenticación del usuario
const authUser = async (req, res) => {
  // const token = req.csrfToken();

  await check("email")
    .isEmail()
    .withMessage("El email es obligatorio")
    .run(req);
  await check("password")
    .notEmpty()
    .withMessage("El password es obligatorio")
    .run(req);

  const resultado = validationResult(req);

  // Verificar si hay error
  if (!resultado.isEmpty()) {
    return res.status(400).json({
      error: resultado.array(),
      // csrfToken: token,
    });
  }

  const { email, password } = req.body;

  // Verificar si el usuario existe
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.status(404).json({
      error: "El usuario no existe",
      // csrfToken: token,
    });
  }

  // Verificar si el usuario está confirmado
  if (!usuario.confirm) {
    return res.status(403).json({
      error: "El usuario no está confirmado",
      // csrfToken: token,
    });
  }

  const passwordCorrecto = await bcrypt.compare(password, usuario.password);
  if (!passwordCorrecto) {
    return res.status(403).json({ error: "Contraseña incorrecta" });
  }

  // Generar JWT y devolverlo
  const tokenJWT = generarJWT({ id: usuario.id, nombre: usuario.nombre });

  return res.status(200).json({
    mensaje: "Autenticación exitosa",
    token: tokenJWT,
    usuario: { id: usuario.id, nombre: usuario.nombre },
    // csrfToken: token,
  });
};

// Registro del usuario
const register = async (req, res) => {
  // Verificación del token CSRF
  // if (req.csrfToken() !== req.body._csrf) {
  //   return res.status(403).json({ error: 'Invalid CSRF token' });
  // }
  // const token = req.csrfToken();
  // Validación
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre no puede ir vacío")
    .run(req);
  await check("email")
    .isEmail()
    .withMessage("El email no es correcto")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser de al menos 6 caracteres")
    .run(req);
  await check("repetir_password")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Los passwords no son iguales");
      return true;
    })
    .run(req);

  const resultado = validationResult(req);

  // Verificar si hay error
  if (!resultado.isEmpty()) {
    return res.status(400).json({
      error: resultado.array(),
      usuario: { nombre: req.body.nombre, email: req.body.email },
      // csrfToken: token,
    });
  }

  const { nombre, email, password } = req.body;

  // Verificar si el usuario ya está registrado
  const existeUsuario = await Usuario.findOne({ where: { email } });
  if (existeUsuario) {
    return res.status(400).json({
      error: "El usuario ya está registrado",
      usuario: { nombre, email },
      // csrfToken: token,
    });
  }

  // Crear nuevo usuario
  const usuario = await Usuario.create({
    nombre,
    email,
    password: await bcrypt.hash(password, 10),
    token: generarId(),
  });

  // Enviar email de confirmación
  emailRegister({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });

  return res.status(201).json({
    mensaje: "Cuenta creada correctamente. Verifica tu email",
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    // csrfToken: token,
  });
};

// Confirmación de registro
const confirmRegister = async (req, res) => {
  try {
    const { token } = req.params;

    const usuario = await Usuario.findOne({ where: { token } });
    if (!usuario) {
      return res.status(400).json({
        mensaje: "Ocurrió un error al confirmar tu cuenta",
        error: true,
      });
    }

    // Confirmar cuenta
    usuario.token = null;
    usuario.confirm = true;

    await usuario.save(); // Guarda los cambios

    return res.status(200).json({
      mensaje: "Cuenta confirmada correctamente",
      error: false,
    });
  } catch (error) {
    console.error("Error al confirmar el registro:", error);
    return res.status(500).json({
      mensaje: "Error interno al confirmar la cuenta",
      error: true,
    });
  }
};

// Reseteo de contraseña
const resetPassword = async (req, res) => {
  // const token = req.csrfToken();

  // Validación del email
  await check("email")
    .isEmail()
    .withMessage("El email no es correcto")
    .run(req);
  const resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.status(400).json({
      error: resultado.array(),
      // csrfToken: token,
    });
  }

  const { email } = req.body;

  // Verificar si el usuario existe
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.status(404).json({
      error: "El email no pertenece a ningún usuario",
      // csrfToken: token,
    });
  }

  // Generar token y enviar email
  usuario.token = generarId();
  await usuario.save();

  emailRecover({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token,
  });

  return res.status(200).json({
    mensaje: "Hemos enviado un email con las instrucciones",
    // csrfToken: token,
  });
};

// Comprobación del token para resetear contraseña
const comprobationToken = async (req, res) => {
  const { token } = req.params;
  // const tokenCSRF = req.csrfToken();

  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    return res.status(400).json({
      mensaje: "Ocurrió un error al validar tu información",
      error: true,
    });
  }

  return res.status(200).json({
    mensaje: "Token válido, procede a cambiar la contraseña",
    // csrfToken: tokenCSRF,
  });
};

// Actualizar la contraseña
const newPassword = async (req, res) => {
  // const tokenCSRF = req.csrfToken();

  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser de al menos 6 caracteres")
    .run(req);

  const resultado = validationResult(req);
  if (!resultado.isEmpty()) {
    return res.status(400).json({
      error: resultado.array(),
      // csrfToken: tokenCSRF,
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ where: { token } });
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);
  usuario.token = null;

  await usuario.save();

  return res.status(200).json({
    mensaje: "Su password fue restablecido correctamente",
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

export {
  register,
  confirmRegister,
  resetPassword,
  comprobationToken,
  newPassword,
  authUser,
  logout,
};
