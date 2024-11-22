export const up = async (knex) => {
  console.log("Migrasi: Membuat tabel analysis_history...");
  return knex.schema.createTable("analysis_history", (table) => {
    table.string("history_id", 255).primary(); // Primary key
    table
      .string("patient_id", 255)
      .notNullable()
      .references("patient_id") // Relasi ke tabel patients
      .inTable("patients")
      .onDelete("CASCADE"); // Cascade delete jika patient dihapus
    table.string("diagnosis", 255).notNullable(); // Diagnosis
    table.string("tingkat_keyakinan", 255).notNullable(); // Tingkat keyakinan
    table.string("jumlah_sel", 255).notNullable(); // Jumlah sel
    table.string("sel_abnormal", 255).notNullable(); // Sel abnormal
    table.string("rata_rata_keyakinan", 255).notNullable(); // Rata-rata keyakinan
    table.text("rekomendasi_medis").nullable(); // Rekomendasi medis
    table.timestamp("timestamp").defaultTo(knex.fn.now()); // Waktu analisis
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Waktu dibuat
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // Waktu diperbarui
  });
};

export const down = async (knex) => {
  console.log("Rollback: Menghapus tabel analysis_history...");
  return knex.schema.dropTable("analysis_history");
};
