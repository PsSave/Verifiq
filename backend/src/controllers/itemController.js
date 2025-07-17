const { body, validationResult } = require("express-validator");
const ListItem = require("../models/ListItem");

// Validações
const createItemValidation = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Nome do item é obrigatório"),
  body("description").optional().trim(),
  body("image")
    .optional()
    .isURL()
    .withMessage("Imagem deve ser uma URL válida"),
];

const updateItemValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Nome do item não pode estar vazio"),
  body("description").optional().trim(),
  body("image")
    .optional()
    .isURL()
    .withMessage("Imagem deve ser uma URL válida"),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Status deve ser boolean"),
];

class ItemController {
  static async createItem(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Dados inválidos",
          details: errors.array(),
        });
      }

      const { listId } = req.params;
      const { name, description, image } = req.body;

      const itemId = await ListItem.create(
        {
          listId: parseInt(listId),
          name,
          description,
          image,
        },
        req.user.id
      );

      const item = await ListItem.findById(itemId);

      res.status(201).json({
        message: "Item criado com sucesso",
        item,
      });
    } catch (error) {
      console.error("Erro ao criar item:", error);
      if (error.message.includes("permissão")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getListItems(req, res) {
    try {
      const { listId } = req.params;

      const items = await ListItem.findByList(parseInt(listId), req.user.id);

      res.json({
        items,
      });
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
      if (error.message.includes("permissão")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getItemById(req, res) {
    try {
      const { id } = req.params;

      const item = await ListItem.findById(parseInt(id));

      if (!item) {
        return res.status(404).json({ error: "Item não encontrado" });
      }

      // Verificar permissão através da lista
      const List = require("../models/List");
      const hasPermission = await List.checkPermission(
        item.list_id,
        req.user.id,
        "read"
      );

      if (!hasPermission) {
        return res
          .status(403)
          .json({ error: "Sem permissão para acessar este item" });
      }

      res.json({
        item,
      });
    } catch (error) {
      console.error("Erro ao buscar item:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateItem(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Dados inválidos",
          details: errors.array(),
        });
      }

      const { id } = req.params;
      const { name, description, image, completed } = req.body;

      const updated = await ListItem.update(
        parseInt(id),
        {
          name,
          description,
          image,
          completed,
        },
        req.user.id
      );

      if (!updated) {
        return res.status(400).json({ error: "Falha ao atualizar item" });
      }

      const item = await ListItem.findById(parseInt(id));

      res.json({
        message: "Item atualizado com sucesso",
        item,
      });
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      if (
        error.message.includes("permissão") ||
        error.message.includes("não encontrado")
      ) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async toggleCompleted(req, res) {
    try {
      const { id } = req.params;

      const updated = await ListItem.toggleCompleted(parseInt(id), req.user.id);

      if (!updated) {
        return res
          .status(400)
          .json({ error: "Falha ao alterar status do item" });
      }

      const item = await ListItem.findById(parseInt(id));

      res.json({
        message: "Status do item alterado com sucesso",
        item,
      });
    } catch (error) {
      console.error("Erro ao alterar status do item:", error);
      if (
        error.message.includes("permissão") ||
        error.message.includes("não encontrado")
      ) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deleteItem(req, res) {
    try {
      const { id } = req.params;

      const deleted = await ListItem.delete(parseInt(id), req.user.id);

      if (!deleted) {
        return res.status(400).json({ error: "Falha ao deletar item" });
      }

      res.json({ message: "Item deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar item:", error);
      if (
        error.message.includes("permissão") ||
        error.message.includes("não encontrado")
      ) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getListStats(req, res) {
    try {
      const { listId } = req.params;

      const stats = await ListItem.getListStats(parseInt(listId), req.user.id);

      res.json({
        stats,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      if (error.message.includes("permissão")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

module.exports = {
  ItemController,
  createItemValidation,
  updateItemValidation,
};
