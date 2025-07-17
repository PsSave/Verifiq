const express = require("express");
const {
  AuthController,
  registerValidation,
  loginValidation,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Rotas públicas
router.post("/register", registerValidation, AuthController.register);
router.post("/login", loginValidation, AuthController.login);

// Rotas protegidas
router.get("/verify", authenticateToken, AuthController.verifyToken);
router.put(
  "/change-password",
  authenticateToken,
  AuthController.changePassword
);

module.exports = router;
