export const up = async (knex) => {
  console.log("Migrasi: Membuat tabel users...");
  return knex.schema.createTable("users", (table) => {
    table.string("user_id", 16).primary(); // ID user unik
    table.string("username").notNullable().unique(); // Username unik
    table.string("password").notNullable(); // Password (hashed)
    table.string("email").notNullable().unique(); // Email unik
    table.string("full_name").notNullable(); // Nama lengkap
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Waktu pembuatan
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // Waktu pembaruan
  });
};

export const down = async (knex) => {
  console.log("Rollback: Menghapus tabel users...");
  return knex.schema.dropTable("users");
};
