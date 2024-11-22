import pool from "../config/db.js";

export const getAllAnalysisHistories = async () => {
  const [histories] = await pool.query(
    "SELECT history_id, patient_id, diagnosis, tingkat_keyakinan, jumlah_sel, sel_abnormal, rata_rata_keyakinan, rekomendasi_medis, timestamp, created_at, updated_at FROM analysis_history"
  );
  return histories;
};

export const getAnalysisHistoryById = async (id) => {
  const [history] = await pool.query(
    "SELECT history_id, patient_id, diagnosis, tingkat_keyakinan, jumlah_sel, sel_abnormal, rata_rata_keyakinan, rekomendasi_medis, timestamp, created_at, updated_at FROM analysis_history WHERE history_id = ?",
    [id]
  );
  return history[0] || null;
};
