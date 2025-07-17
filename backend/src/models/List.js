const database = require("../database/database");

class List {
  static async create(listData, userId) {
    const { name, description, isIndividual } = listData;

    await database.connect();
    const result = await database.run(
      "INSERT INTO lists (name, description, is_individual, created_by) VALUES (?, ?, ?, ?)",
      [name, description, isIndividual ? 1 : 0, userId]
    );

    return result.id;
  }

  static async findById(id) {
    await database.connect();
    return await database.get(
      `
      SELECT l.*, u.name as creator_name 
      FROM lists l 
      JOIN users u ON l.created_by = u.id 
      WHERE l.id = ?
    `,
      [id]
    );
  }

  static async findByUser(userId) {
    await database.connect();

    // Buscar listas próprias e compartilhadas
    const lists = await database.all(
      `
      SELECT DISTINCT l.*, u.name as creator_name,
             CASE WHEN l.created_by = ? THEN 'owner' ELSE ls.permission END as user_permission
      FROM lists l 
      JOIN users u ON l.created_by = u.id 
      LEFT JOIN list_shares ls ON l.id = ls.list_id AND ls.user_id = ?
      WHERE l.created_by = ? OR ls.user_id = ?
      ORDER BY l.updated_at DESC
    `,
      [userId, userId, userId, userId]
    );

    return lists;
  }

  static async update(id, listData, userId) {
    const { name, description } = listData;

    await database.connect();

    // Verificar permissão
    const hasPermission = await this.checkPermission(id, userId, "write");
    if (!hasPermission) {
      throw new Error("Sem permissão para editar esta lista");
    }

    const result = await database.run(
      "UPDATE lists SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [name, description, id]
    );

    return result.changes > 0;
  }

  static async delete(id, userId) {
    await database.connect();

    // Verificar se é o dono da lista
    const list = await database.get(
      "SELECT created_by FROM lists WHERE id = ?",
      [id]
    );
    if (!list || list.created_by !== userId) {
      throw new Error("Apenas o criador pode deletar a lista");
    }

    const result = await database.run("DELETE FROM lists WHERE id = ?", [id]);
    return result.changes > 0;
  }

  static async shareList(listId, userEmail, permission, ownerId) {
    await database.connect();

    // Verificar se é o dono da lista
    const list = await database.get(
      "SELECT created_by, is_individual FROM lists WHERE id = ?",
      [listId]
    );
    if (!list || list.created_by !== ownerId) {
      throw new Error("Apenas o criador pode compartilhar a lista");
    }

    if (list.is_individual) {
      throw new Error("Listas individuais não podem ser compartilhadas");
    }

    // Buscar usuário pelo email
    const user = await database.get("SELECT id FROM users WHERE email = ?", [
      userEmail,
    ]);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Verificar se já não está compartilhada
    const existingShare = await database.get(
      "SELECT id FROM list_shares WHERE list_id = ? AND user_id = ?",
      [listId, user.id]
    );

    if (existingShare) {
      // Atualizar permissão
      await database.run(
        "UPDATE list_shares SET permission = ? WHERE list_id = ? AND user_id = ?",
        [permission, listId, user.id]
      );
    } else {
      // Criar novo compartilhamento
      await database.run(
        "INSERT INTO list_shares (list_id, user_id, permission) VALUES (?, ?, ?)",
        [listId, user.id, permission]
      );
    }

    return true;
  }

  static async removeShare(listId, userId, ownerId) {
    await database.connect();

    // Verificar se é o dono da lista
    const list = await database.get(
      "SELECT created_by FROM lists WHERE id = ?",
      [listId]
    );
    if (!list || list.created_by !== ownerId) {
      throw new Error("Apenas o criador pode remover compartilhamentos");
    }

    const result = await database.run(
      "DELETE FROM list_shares WHERE list_id = ? AND user_id = ?",
      [listId, userId]
    );

    return result.changes > 0;
  }

  static async getSharedUsers(listId, ownerId) {
    await database.connect();

    // Verificar se é o dono da lista
    const list = await database.get(
      "SELECT created_by FROM lists WHERE id = ?",
      [listId]
    );
    if (!list || list.created_by !== ownerId) {
      throw new Error("Apenas o criador pode ver os compartilhamentos");
    }

    return await database.all(
      `
      SELECT u.id, u.name, u.email, ls.permission, ls.created_at as shared_at
      FROM list_shares ls
      JOIN users u ON ls.user_id = u.id
      WHERE ls.list_id = ?
      ORDER BY ls.created_at DESC
    `,
      [listId]
    );
  }

  static async checkPermission(listId, userId, requiredPermission = "read") {
    await database.connect();

    // Verificar se é o dono
    const list = await database.get(
      "SELECT created_by FROM lists WHERE id = ?",
      [listId]
    );
    if (list && list.created_by === userId) {
      return true;
    }

    // Verificar compartilhamento
    const share = await database.get(
      "SELECT permission FROM list_shares WHERE list_id = ? AND user_id = ?",
      [listId, userId]
    );

    if (!share) {
      return false;
    }

    // Verificar nível de permissão
    const permissions = ["read", "write", "admin"];
    const userLevel = permissions.indexOf(share.permission);
    const requiredLevel = permissions.indexOf(requiredPermission);

    return userLevel >= requiredLevel;
  }

  static async getListItems(listId, userId) {
    await database.connect();

    // Verificar permissão
    const hasPermission = await this.checkPermission(listId, userId, "read");
    if (!hasPermission) {
      throw new Error("Sem permissão para ver esta lista");
    }

    return await database.all(
      `
      SELECT * FROM list_items 
      WHERE list_id = ? 
      ORDER BY created_at DESC
    `,
      [listId]
    );
  }
}

module.exports = List;
