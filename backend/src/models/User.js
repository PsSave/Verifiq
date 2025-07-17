const database = require("../database/database");
const bcrypt = require("bcryptjs");

class User {
  static async create(userData) {
    const { name, email, password } = userData;

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    await database.connect();
    const result = await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return result.id;
  }

  static async findByEmail(email) {
    await database.connect();
    return await database.get("SELECT * FROM users WHERE email = ?", [email]);
  }

  static async findById(id) {
    await database.connect();
    const user = await database.get(
      "SELECT id, name, email, avatar, created_at FROM users WHERE id = ?",
      [id]
    );
    return user;
  }

  static async update(id, userData) {
    const { name, email, avatar } = userData;

    await database.connect();
    const result = await database.run(
      "UPDATE users SET name = ?, email = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [name, email, avatar, id]
    );

    return result.changes > 0;
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await database.connect();
    const result = await database.run(
      "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [hashedPassword, id]
    );

    return result.changes > 0;
  }

  static async delete(id) {
    await database.connect();
    const result = await database.run("DELETE FROM users WHERE id = ?", [id]);
    return result.changes > 0;
  }

  static async validatePassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  static async getStats(userId) {
    await database.connect();

    const listsCreated = await database.get(
      "SELECT COUNT(*) as count FROM lists WHERE created_by = ?",
      [userId]
    );

    const itemsCompleted = await database.get(
      `SELECT COUNT(*) as count FROM list_items li 
       JOIN lists l ON li.list_id = l.id 
       WHERE l.created_by = ? AND li.completed = 1`,
      [userId]
    );

    return {
      listsCreated: listsCreated.count,
      itemsCompleted: itemsCompleted.count,
    };
  }
}

module.exports = User;
