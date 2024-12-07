const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.id }; // Almacena el ID del usuario en la solicitud
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = authenticateUser;
