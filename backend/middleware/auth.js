const jwt = require("jsonwebtoken");

exports.authenticateJWT = (req, res, next) => {
  // Cogemos todo el valor "Bearer token"
  const authHeader = req.header("Authorization");
  // Quitamos el "Bearer" ya que solo necesitamos el valor del token
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso denegado, token no válido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token inválido" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Acceso denegado, no eres un administrador" });
  }
};
