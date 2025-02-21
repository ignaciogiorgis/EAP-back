const { check, validationResult } = require("express-validator");
const User = require("../models/User.js");
const { generarId, generarJWT } = require("../helpers/tokens.js");
const bcrypt = require("bcrypt");
const { uploadImage } = require("../helpers/cloudinary");
const fs = require("fs");
const { sendEmail } = require("../helpers/emails.js");
const { getEmailTemplate } = require("../utils/emailTemplates");

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

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({
      error: "The user does not exist",
    });
  }

  if (!user.confirm) {
    return res.status(403).json({
      error: "The user is not confirmed",
    });
  }

  const passwordCorrect = await bcrypt.compare(password, user.password);
  if (!passwordCorrect) {
    return res.status(403).json({ error: "Incorrect password" });
  }

  const tokenJWT = generarJWT({ id: user.id, name: user.name });

  return res.status(200).json({
    message: "Successful authentication",
    token: tokenJWT,
    user: { id: user.id, name: user.name },
  });
};

const register = async (req, res) => {
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

  if (!result.isEmpty()) {
    return res.status(400).json({
      error: result.array(),
      user: { name: req.body.name, email: req.body.email },
    });
  }

  const { name, email, password } = req.body;

  const userExist = await User.findOne({ where: { email } });
  if (userExist) {
    return res.status(400).json({
      error: "The user is already registered",
      user: { name, email },
    });
  }

  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    token: generarId(),
  });

  const confirmUrl = `${process.env.FRONTEND_URL}/auth/confirm/${user.token}`;

  const htmlContent = getEmailTemplate("confirmation", {
    name: user.name,
    confirmUrl,
  });

  try {
    await sendEmail(
      email,
      user.name,
      "Confirm Your Account",
      htmlContent,
      `Hello ${user.name}, confirm your account at ${confirmUrl}`
    );
  } catch (error) {
    return res.status(500).json({
      error: "Error sending confirmation email",
      details: error.message,
    });
  }

  return res.status(201).json({
    message: "Account created successfully. Verify your email",
    user: { id: user.id, name: user.name, email: user.email },
  });
};

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

    user.token = null;
    user.confirm = true;

    await user.save();

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

const resetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const resetUrl = `${process.env.FRONTEND_URL}/auth/recover/${user.token}`;

  const htmlContent = getEmailTemplate("resetPassword", {
    name: user.name,
    resetUrl,
  });

  try {
    await sendEmail(
      email,
      user.name,
      "Reset Your Password",
      htmlContent,
      `Hello ${user.name}, reset your password at ${resetUrl}`
    );
    res.json({ message: "Password reset email sent successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error sending email", details: error.message });
  }
};
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

const showProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      message: user.message,
    });
  } catch (error) {
    console.error("Error getting profile:", error);
    return res.status(500).json({ error: "Error getting profile" });
  }
};

const uploadPictureProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }
    const imageUrl = await uploadImage(req.file.path);
    fs.unlinkSync(req.file.path);

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.picture = imageUrl;
    await user.save();

    return res.json({
      message: "Image uploaded successfully",
      url: imageUrl,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ error: "Error uploading image" });
  }
};

const editProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, picture, message } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user?.dataValues?.id !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to edit this Profile" });
    }

    await user.update({
      name: name ?? user.name,
      email: email ?? user.email,
      picture: picture ?? user.picture,
      message: message ?? user.message,
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating Profile:", error);
    return res
      .status(500)
      .json({ error: "There was a problem updating the profile" });
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
  showProfile,
  editProfile,
};
