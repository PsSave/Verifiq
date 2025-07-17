const express = require("express");
const {
  ItemController,
  createItemValidation,
  updateItemValidation,
} = require("../controllers/itemController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Todas as rotas de itens são protegidas
router.use(authenticateToken);

// CRUD de itens por lista
router.post("/list/:listId", createItemValidation, ItemController.createItem);
router.get("/list/:listId", ItemController.getListItems);
router.get("/list/:listId/stats", ItemController.getListStats);

// CRUD de itens individuais
router.get("/:id", ItemController.getItemById);
router.put("/:id", updateItemValidation, ItemController.updateItem);
router.patch("/:id/toggle", ItemController.toggleCompleted);
router.delete("/:id", ItemController.deleteItem);

module.exports = router;
