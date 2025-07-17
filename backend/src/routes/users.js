const express = require("express");
const {
  UserController,
  updateUserValidation,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Todas as rotas de usuário são protegidas
router.use(authenticateToken);

router.get("/profile", UserController.getProfile);
router.put("/profile", updateUserValidation, UserController.updateProfile);
router.delete("/account", UserController.deleteAccount);
router.get("/export", UserController.exportData);

module.exports = router;
