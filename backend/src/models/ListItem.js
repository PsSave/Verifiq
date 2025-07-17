const database = require("../database/database");
const List = require("./List");

class ListItem {
  static async create(itemData, userId) {
    const { listId, name, description, image } = itemData;

    await database.connect();

    // Verificar permissão de escrita na lista
    const hasPermission = await List.checkPermission(listId, userId, "write");
    if (!hasPermission) {
      throw new Error("Sem permissão para adicionar itens nesta lista");
    }

    const result = await database.run(
      "INSERT INTO list_items (list_id, name, description, image) VALUES (?, ?, ?, ?)",
      [listId, name, description, image]
    );

    // Atualizar timestamp da lista
    await database.run(
      "UPDATE lists SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [listId]
    );

    return result.id;
  }

  static async findById(id) {
    await database.connect();
    return await database.get("SELECT * FROM list_items WHERE id = ?", [id]);
  }

  static async findByList(listId, userId) {
    await database.connect();

    // Verificar permissão de leitura na lista
    const hasPermission = await List.checkPermission(listId, userId, "read");
    if (!hasPermission) {
      throw new Error("Sem permissão para ver os itens desta lista");
    }

    return await database.all(
      `
      SELECT * FROM list_items 
      WHERE list_id = ? 
      ORDER BY completed ASC, created_at DESC
    `,
      [listId]
    );
  }

  static async update(id, itemData, userId) {
    const { name, description, image, completed } = itemData;

    await database.connect();

    // Buscar o item para verificar a lista
    const item = await database.get(
      "SELECT list_id FROM list_items WHERE id = ?",
      [id]
    );
    if (!item) {
      throw new Error("Item não encontrado");
    }

    // Verificar permissão de escrita na lista
    const hasPermission = await List.checkPermission(
      item.list_id,
      userId,
      "write"
    );
    if (!hasPermission) {
      throw new Error("Sem permissão para editar itens desta lista");
    }

    const result = await database.run(
      "UPDATE list_items SET name = ?, description = ?, image = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [name, description, image, completed ? 1 : 0, id]
    );

    // Atualizar timestamp da lista
    await database.run(
      "UPDATE lists SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [item.list_id]
    );

    return result.changes > 0;
  }

  static async toggleCompleted(id, userId) {
    await database.connect();

    // Buscar o item atual
    const item = await database.get(
      "SELECT list_id, completed FROM list_items WHERE id = ?",
      [id]
    );
    if (!item) {
      throw new Error("Item não encontrado");
    }

    // Verificar permissão de escrita na lista
    const hasPermission = await List.checkPermission(
      item.list_id,
      userId,
      "write"
    );
    if (!hasPermission) {
      throw new Error("Sem permissão para modificar itens desta lista");
    }

    const newStatus = item.completed ? 0 : 1;

    const result = await database.run(
      "UPDATE list_items SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [newStatus, id]
    );

    // Atualizar timestamp da lista
    await database.run(
      "UPDATE lists SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [item.list_id]
    );

    return result.changes > 0;
  }

  static async delete(id, userId) {
    await database.connect();

    // Buscar o item para verificar a lista
    const item = await database.get(
      "SELECT list_id FROM list_items WHERE id = ?",
      [id]
    );
    if (!item) {
      throw new Error("Item não encontrado");
    }

    // Verificar permissão de escrita na lista
    const hasPermission = await List.checkPermission(
      item.list_id,
      userId,
      "write"
    );
    if (!hasPermission) {
      throw new Error("Sem permissão para deletar itens desta lista");
    }

    const result = await database.run("DELETE FROM list_items WHERE id = ?", [
      id,
    ]);

    // Atualizar timestamp da lista
    await database.run(
      "UPDATE lists SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [item.list_id]
    );

    return result.changes > 0;
  }

  static async getListStats(listId, userId) {
    await database.connect();

    // Verificar permissão de leitura na lista
    const hasPermission = await List.checkPermission(listId, userId, "read");
    if (!hasPermission) {
      throw new Error("Sem permissão para ver estatísticas desta lista");
    }

    const total = await database.get(
      "SELECT COUNT(*) as count FROM list_items WHERE list_id = ?",
      [listId]
    );

    const completed = await database.get(
      "SELECT COUNT(*) as count FROM list_items WHERE list_id = ? AND completed = 1",
      [listId]
    );

    return {
      total: total.count,
      completed: completed.count,
      pending: total.count - completed.count,
      percentage:
        total.count > 0 ? Math.round((completed.count / total.count) * 100) : 0,
    };
  }
}

module.exports = ListItem;
