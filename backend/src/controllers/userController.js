const { body, validationResult } = require("express-validator");
const User = require("../models/User");

// Validações
const updateUserValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Nome deve ter pelo menos 2 caracteres"),
  body("email").optional().isEmail().withMessage("Email inválido"),
  body("avatar")
    .optional()
    .isURL()
    .withMessage("Avatar deve ser uma URL válida"),
];

class UserController {
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Buscar estatísticas do usuário
      const stats = await User.getStats(req.user.id);

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.created_at,
        },
        stats,
      });
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Dados inválidos",
          details: errors.array(),
        });
      }

      const { name, email, avatar } = req.body;

      // Verificar se o email já está em uso (se foi alterado)
      if (email && email !== req.user.email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
          return res.status(409).json({ error: "Email já está em uso" });
        }
      }

      // Atualizar dados
      const updated = await User.update(req.user.id, {
        name: name || req.user.name,
        email: email || req.user.email,
        avatar: avatar || null,
      });

      if (!updated) {
        return res.status(400).json({ error: "Falha ao atualizar perfil" });
      }

      // Buscar dados atualizados
      const user = await User.findById(req.user.id);

      res.json({
        message: "Perfil atualizado com sucesso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deleteAccount(req, res) {
    try {
      const { password } = req.body;

      if (!password) {
        return res
          .status(400)
          .json({ error: "Senha é obrigatória para deletar a conta" });
      }

      // Buscar usuário completo para verificar senha
      const user = await User.findByEmail(req.user.email);

      // Verificar senha
      const isValidPassword = await User.validatePassword(user, password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Senha incorreta" });
      }

      // Deletar conta (cascade vai deletar listas e itens)
      const deleted = await User.delete(req.user.id);

      if (!deleted) {
        return res.status(400).json({ error: "Falha ao deletar conta" });
      }

      res.json({ message: "Conta deletada com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async exportData(req, res) {
    try {
      // Buscar todas as listas do usuário
      const List = require("../models/List");
      const ListItem = require("../models/ListItem");

      const lists = await List.findByUser(req.user.id);

      // Para cada lista, buscar os itens
      const userData = {
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
        },
        lists: [],
      };

      for (const list of lists) {
        const items = await ListItem.findByList(list.id, req.user.id);
        userData.lists.push({
          ...list,
          items,
        });
      }

      res.json({
        message: "Dados exportados com sucesso",
        data: userData,
        exportedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

module.exports = {
  UserController,
  updateUserValidation,
};
