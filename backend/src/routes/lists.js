const express = require("express");
const {
  ListController,
  createListValidation,
  updateListValidation,
  shareListValidation,
} = require("../controllers/listController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Todas as rotas de lista são protegidas
router.use(authenticateToken);

// CRUD básico de listas
router.post("/", createListValidation, ListController.createList);
router.get("/", ListController.getUserLists);
router.get("/:id", ListController.getListById);
router.put("/:id", updateListValidation, ListController.updateList);
router.delete("/:id", ListController.deleteList);

// Compartilhamento de listas
router.post("/:id/share", shareListValidation, ListController.shareList);
router.delete("/:id/share/:userId", ListController.removeShare);
router.get("/:id/shared-users", ListController.getSharedUsers);

module.exports = router;
