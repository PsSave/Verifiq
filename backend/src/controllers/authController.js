const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

// Validações
const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Nome deve ter pelo menos 2 caracteres"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Senha deve ter pelo menos 6 caracteres"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Senha é obrigatória"),
];

class AuthController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Dados inválidos",
          details: errors.array(),
        });
      }

      const { name, email, password } = req.body;

      // Verificar se usuário já existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email já está em uso" });
      }

      // Criar usuário
      const userId = await User.create({ name, email, password });

      // Gerar token
      const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });

      // Buscar dados do usuário criado
      const user = await User.findById(userId);

      res.status(201).json({
        message: "Usuário criado com sucesso",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error("Erro no registro:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Dados inválidos",
          details: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Buscar usuário
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      // Verificar senha
      const isValidPassword = await User.validatePassword(user, password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      // Gerar token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.json({
        message: "Login realizado com sucesso",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async verifyToken(req, res) {
    try {
      // Token já foi verificado pelo middleware
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json({
        valid: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error("Erro na verificação do token:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ error: "Senha atual e nova senha são obrigatórias" });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Nova senha deve ter pelo menos 6 caracteres" });
      }

      // Buscar usuário completo (com senha)
      const user = await User.findByEmail(req.user.email);

      // Verificar senha atual
      const isValidPassword = await User.validatePassword(
        user,
        currentPassword
      );
      if (!isValidPassword) {
        return res.status(401).json({ error: "Senha atual incorreta" });
      }

      // Atualizar senha
      await User.updatePassword(req.user.id, newPassword);

      res.json({ message: "Senha alterada com sucesso" });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

module.exports = {
  AuthController,
  registerValidation,
  loginValidation,
};
