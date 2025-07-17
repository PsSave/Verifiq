const { body, validationResult } = require("express-validator");
const List = require("../models/List");
const ListItem = require("../models/ListItem");

// Validações
const createListValidation = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Nome da lista é obrigatório"),
  body("description").optional().trim(),
  body("isIndividual")
    .isBoolean()
    .withMessage("Tipo da lista deve ser boolean"),
];

const updateListValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Nome da lista não pode estar vazio"),
  body("description").optional().trim(),
];

const shareListValidation = [
  body("email").isEmail().withMessage("Email inválido"),
  body("permission")
    .isIn(["read", "write", "admin"])
    .withMessage("Permissão inválida"),
];

class ListController {
  static async createList(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Dados inválidos",
          details: errors.array(),
        });
      }

      const { name, description, isIndividual } = req.body;

      const listId = await List.create(
        {
          name,
          description,
          isIndividual,
        },
        req.user.id
      );

      const list = await List.findById(listId);

      res.status(201).json({
        message: "Lista criada com sucesso",
        list,
      });
    } catch (error) {
      console.error("Erro ao criar lista:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getUserLists(req, res) {
    try {
      const lists = await List.findByUser(req.user.id);

      // Para cada lista, buscar estatísticas
      const listsWithStats = await Promise.all(
        lists.map(async (list) => {
          try {
            const stats = await ListItem.getListStats(list.id, req.user.id);
            return { ...list, stats };
          } catch (error) {
            // Se não tiver permissão para ver estatísticas, retorna sem elas
            return list;
          }
        })
      );

      res.json({
        lists: listsWithStats,
      });
    } catch (error) {
      console.error("Erro ao buscar listas:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getListById(req, res) {
    try {
      const { id } = req.params;

      // Verificar permissão
      const hasPermission = await List.checkPermission(id, req.user.id, "read");
      if (!hasPermission) {
        return res
          .status(403)
          .json({ error: "Sem permissão para acessar esta lista" });
      }

      const list = await List.findById(id);
      if (!list) {
        return res.status(404).json({ error: "Lista não encontrada" });
      }

      // Buscar itens da lista
      const items = await ListItem.findByList(id, req.user.id);

      // Buscar estatísticas
      const stats = await ListItem.getListStats(id, req.user.id);

      res.json({
        list: {
          ...list,
          stats,
          items,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar lista:", error);
      if (error.message.includes("permissão")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateList(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Dados inválidos",
          details: errors.array(),
        });
      }

      const { id } = req.params;
      const { name, description } = req.body;

      const updated = await List.update(id, { name, description }, req.user.id);

      if (!updated) {
        return res.status(400).json({ error: "Falha ao atualizar lista" });
      }

      const list = await List.findById(id);

      res.json({
        message: "Lista atualizada com sucesso",
        list,
      });
    } catch (error) {
      console.error("Erro ao atualizar lista:", error);
      if (error.message.includes("permissão")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deleteList(req, res) {
    try {
      const { id } = req.params;

      const deleted = await List.delete(id, req.user.id);

      if (!deleted) {
        return res.status(400).json({ error: "Falha ao deletar lista" });
      }

      res.json({ message: "Lista deletada com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar lista:", error);
      if (
        error.message.includes("permissão") ||
        error.message.includes("criador")
      ) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async shareList(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Dados inválidos",
          details: errors.array(),
        });
      }

      const { id } = req.params;
      const { email, permission } = req.body;

      await List.shareList(id, email, permission, req.user.id);

      res.json({ message: "Lista compartilhada com sucesso" });
    } catch (error) {
      console.error("Erro ao compartilhar lista:", error);
      if (
        error.message.includes("permissão") ||
        error.message.includes("criador") ||
        error.message.includes("individual") ||
        error.message.includes("não encontrado")
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async removeShare(req, res) {
    try {
      const { id, userId } = req.params;

      const removed = await List.removeShare(id, parseInt(userId), req.user.id);

      if (!removed) {
        return res
          .status(400)
          .json({ error: "Falha ao remover compartilhamento" });
      }

      res.json({ message: "Compartilhamento removido com sucesso" });
    } catch (error) {
      console.error("Erro ao remover compartilhamento:", error);
      if (
        error.message.includes("permissão") ||
        error.message.includes("criador")
      ) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getSharedUsers(req, res) {
    try {
      const { id } = req.params;

      const sharedUsers = await List.getSharedUsers(id, req.user.id);

      res.json({
        sharedUsers,
      });
    } catch (error) {
      console.error("Erro ao buscar usuários compartilhados:", error);
      if (
        error.message.includes("permissão") ||
        error.message.includes("criador")
      ) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

module.exports = {
  ListController,
  createListValidation,
  updateListValidation,
  shareListValidation,
};
