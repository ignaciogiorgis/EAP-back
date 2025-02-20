const fs = require("fs");
const path = require("path");

const getEmailTemplate = (templateName, replacements) => {
  try {
    // Leer el archivo de la plantilla
    const filePath = path.join(
      __dirname,
      "../templates",
      `${templateName}.html`
    );
    let template = fs.readFileSync(filePath, "utf8");

    // Reemplazar las variables dentro del HTML
    Object.keys(replacements).forEach((key) => {
      template = template.replace(
        new RegExp(`{{${key}}}`, "g"),
        replacements[key]
      );
    });

    return template;
  } catch (error) {
    console.error("Error loading email template:", error);
    return "";
  }
};

module.exports = { getEmailTemplate };
