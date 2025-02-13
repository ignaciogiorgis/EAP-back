const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Configuración
const MODEL_NAME = "sales"; // Nombre de la tabla
const TIMESTAMP = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
const MIGRATION_FILE = path.join(
  "migrations",
  `${TIMESTAMP}-add-fields-to-${MODEL_NAME}.js`
);
const newFields = [
  { name: "clientId", type: "INTEGER", allowNull: false, defaultValue: 0 },
];

// Asegurar que la carpeta migrations existe
if (!fs.existsSync("migrations")) {
  fs.mkdirSync("migrations");
}

// Generar contenido de la migración
const migrationTemplate = `'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    ${newFields
      .map(
        (
          field
        ) => `await queryInterface.addColumn("${MODEL_NAME}", "${field.name}", {
      type: Sequelize.${field.type},
      allowNull: ${field.allowNull},
      defaultValue: ${field.defaultValue}
    });`
      )
      .join("\n    ")}
  },

  async down(queryInterface, Sequelize) {
    ${newFields
      .map(
        (field) =>
          `await queryInterface.removeColumn("${MODEL_NAME}", "${field.name}");`
      )
      .join("\n    ")}
  }
};`;

// Escribir el archivo de migración
fs.writeFileSync(MIGRATION_FILE, migrationTemplate, "utf8");

console.log(`✅ Migración creada: ${MIGRATION_FILE}`);

// Ejecutar la migración automáticamente
execSync("npx sequelize-cli db:migrate", { stdio: "inherit" });
