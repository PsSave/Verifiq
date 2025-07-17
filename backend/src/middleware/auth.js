const jwt = require("jsonwebtoken");
const database = require("../database/database");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Token de acesso requerido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar se o usuário ainda existe
    await database.connect();
    const user = await database.get(
      "SELECT id, name, email FROM users WHERE id = ?",
      [decoded.userId]
    );

    if (!user) {
      return res
        .status(401)
        .json({ error: "Token inválido - usuário não encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }
    return res.status(403).json({ error: "Token inválido" });
  }
};

module.exports = { authenticateToken };
