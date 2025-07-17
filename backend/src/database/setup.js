const database = require("./database");
require("dotenv").config();

async function createTables() {
  try {
    await database.connect();

    // Tabela de usuários
    await database.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de listas
    await database.run(`
      CREATE TABLE IF NOT EXISTS lists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        is_individual BOOLEAN DEFAULT 1,
        created_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Tabela de itens das listas
    await database.run(`
      CREATE TABLE IF NOT EXISTS list_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        list_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT 0,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE
      )
    `);

    // Tabela de compartilhamento de listas (para listas compartilhadas)
    await database.run(`
      CREATE TABLE IF NOT EXISTS list_shares (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        list_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        permission TEXT DEFAULT 'read', -- 'read', 'write', 'admin'
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE(list_id, user_id)
      )
    `);

    // Índices para melhor performance
    await database.run(
      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
    );
    await database.run(
      `CREATE INDEX IF NOT EXISTS idx_lists_created_by ON lists(created_by)`
    );
    await database.run(
      `CREATE INDEX IF NOT EXISTS idx_list_items_list_id ON list_items(list_id)`
    );
    await database.run(
      `CREATE INDEX IF NOT EXISTS idx_list_shares_list_id ON list_shares(list_id)`
    );
    await database.run(
      `CREATE INDEX IF NOT EXISTS idx_list_shares_user_id ON list_shares(user_id)`
    );

    console.log("✅ Tabelas criadas com sucesso!");

    // Inserir usuário padrão para testes
    const existingUser = await database.get(
      "SELECT id FROM users WHERE email = ?",
      ["admin@verifiq.com"]
    );

    if (!existingUser) {
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await database.run(
        `
        INSERT INTO users (name, email, password) 
        VALUES (?, ?, ?)
      `,
        ["Administrador", "admin@verifiq.com", hashedPassword]
      );

      console.log("👤 Usuário padrão criado: admin@verifiq.com / admin123");
    }
  } catch (error) {
    console.error("❌ Erro ao criar tabelas:", error);
  } finally {
    await database.close();
  }
}

// Se executado diretamente
if (require.main === module) {
  createTables();
}

module.exports = createTables;
