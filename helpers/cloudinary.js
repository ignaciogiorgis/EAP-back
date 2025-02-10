// helpers/cloudinary.js
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para subir imágenes
const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "perfil_usuarios", // Carpeta donde se guardarán las imágenes
    });
    return result.secure_url; // Devuelve la URL de la imagen subida
  } catch (error) {
    console.error("Error al subir la imagen a Cloudinary:", error);
    throw new Error("Error al subir la imagen");
  }
};

module.exports = { uploadImage };
