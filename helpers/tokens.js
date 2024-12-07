const jwt = require("jsonwebtoken");

const generarId = () => {
  return Math.random().toString(32).substring(32) + Date.now().toString(32);
};

const generarJWT = (datos) => {
  const tokenJWT = jwt.sign(
    {
      id: datos.id,
      nombre: datos.nombre,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return tokenJWT;
};

module.exports = { generarJWT, generarId };
