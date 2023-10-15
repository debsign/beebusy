// Importación del módulo JSON Web Tokens
const jwt = require("jsonwebtoken");
// Middleware authenticateJWT: autenticación de las solicitudes (verifica el token de la cabecera)
exports.authenticateJWT = (req, res, next) => {
  // El formato es Bearer <token> por lo que:
  // 1. Cogemos todo el valor "Bearer token"
  const authHeader = req.header("Authorization");
  // 2. Quitamos el "Bearer" ya que solo necesitamos el valor del token
  const token = authHeader && authHeader.split(" ")[1];
  // Verificación del token
  // Si no hay token, acceso denegado
  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso denegado, el token no es válido" });
  }
  // Si hay token:
  try {
    // Función "jwt.verify": error si el token es inválido o ha expirado
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Se decodifica
    req.user = decoded;
    // Pasamos al siguiente middleware
    next();
  } catch (error) {
    res.status(400).json({ message: "El token es inválido o ha expirado" });
  }
};
// Middleware isAdmin: comprobamos el rol del usuario
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    // Si es admin, tiene acceso
    next();
  } else {
    res
      // Si no, no accede
      .status(403)
      .json({ message: "Acceso denegado, no eres un administrador" });
  }
};
