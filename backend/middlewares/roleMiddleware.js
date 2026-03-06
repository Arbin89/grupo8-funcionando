// Middleware para validar roles permitidos
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // Verificamos que haya un usuario autenticado
    if (!req.user) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    // Validamos si el rol del usuario está dentro de los permitidos
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "No tienes permisos para acceder a esta ruta",
      });
    }

    // Si todo está bien, continúa a la siguiente función
    next();
  };
};

module.exports = roleMiddleware;