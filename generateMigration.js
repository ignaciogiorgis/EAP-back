const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const MODEL_NAME = "sales";
const TIMESTAMP = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
const MIGRATION_FILE = path.join(
  "migrations",
  `${TIMESTAMP}-add-fields-to-${MODEL_NAME}.js`
);
const newFields = [
  { name: "clientId", type: "INTEGER", allowNull: false, defaultValue: 0 },
];

if (!fs.existsSync("migrations")) {
  fs.mkdirSync("migrations");
}

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

fs.writeFileSync(MIGRATION_FILE, migrationTemplate, "utf8");

console.log(`✅ Migración creada: ${MIGRATION_FILE}`);

execSync("npx sequelize-cli db:migrate", { stdio: "inherit" });
