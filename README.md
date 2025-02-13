# boilerplate-backend
# EAP-front

🚀 Automatización de Migraciones en Sequelize
Este proyecto usa un script automatizado para generar y modificar migraciones de Sequelize. Con este sistema, puedes agregar nuevos campos en los modelos sin necesidad de escribir las migraciones manualmente.

📌 Instalación y Configuración
Antes de empezar, asegúrate de tener Sequelize CLI instalado en el proyecto:


npm install --save-dev sequelize-cli

Si aún no has inicializado Sequelize en tu proyecto, usa:


npx sequelize-cli init

Esto creará la estructura de carpetas necesarias en config, models, migrations, etc.

🛠 Uso del Script Automático
Cada vez que necesites agregar nuevos campos a una tabla, sigue estos pasos:

1️⃣ Edita el script generateMigration.js

En la raíz del proyecto, busca el archivo generateMigration.js.
Agrega los nuevos campos en la variable newFields, siguiendo el formato:
js
Copiar
Editar
const newFields = [
  { name: "profit", type: "FLOAT", allowNull: false, defaultValue: 0 },
  { name: "cost", type: "FLOAT", allowNull: false, defaultValue: 0 },
];


2️⃣ Ejecuta el script para generar y modificar automáticamente la migración:



node generateMigration.js

Esto hará lo siguiente: ✅ Crea un nuevo archivo de migración.

✅ Edita automáticamente la migración para agregar los nuevos campos.
✅ Genera la lógica de up y down para migrar y revertir los cambios.

3️⃣ Ejecuta la migración para aplicar los cambios en la base de datos:


npx sequelize-cli db:migrate


4️⃣ Verifica en la base de datos que los nuevos campos se han agregado correctamente.

🔄 Revertir una Migración
Si necesitas deshacer la última migración, usa:


npx sequelize-cli db:migrate:undo

Si quieres revertir todas las migraciones:

npx sequelize-cli db:migrate:undo:all

Luego, puedes volver a ejecutar el script y la migración para corregir cualquier error.
