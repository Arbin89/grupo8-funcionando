const jwt = require("jsonwebtoken");

// Middleware para validar que el token exista y sea correcto
const authMiddleware = (req, res, next) => {
  try {
    // Leemos el header Authorization
    const authHeader = req.headers.authorization;

    // Verificamos que exista y que tenga formato Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No se proporcionó un token válido",
      });
    }

    // Extraemos el token quitando el texto "Bearer "
    const token = authHeader.split(" ")[1];

    // Verificamos el token con la clave secreta
    const decoded = jwt.verify(token, "siger_secreto_2026");

    // Guardamos la información del usuario dentro de req.user
    req.user = decoded;

    // Continuamos a la siguiente función o ruta
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;