import pool from "../config/db.js";
import { customAlphabet } from "nanoid";

// Generate patient ID dengan nanoid
const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const generatePatientId = customAlphabet(alphabet, 12);

export const createPatient = async ({ name, age, gender, address }) => {
  const patient_id = `pt_${generatePatientId()}`;

  const [result] = await pool.query(
    "INSERT INTO patients (patient_id, name, age, gender, address) VALUES (?, ?, ?, ?, ?)",
    [patient_id, name, age, gender, address]
  );

  return {
    patient_id,
    name,
    age,
    gender,
    address,
    created_at: result.created_at,
  };
};

export const getAllPatients = async () => {
  const [patients] = await pool.query(
    "SELECT patient_id, name, age, gender, address, created_at, updated_at FROM patients"
  );
  return patients;
};

export const getPatientById = async (id) => {
  const [patient] = await pool.query(
    "SELECT patient_id, name, age, gender, address, created_at, updated_at FROM patients WHERE patient_id = ?",
    [id]
  );
  return patient[0] || null;
};

export const updatePatient = async (id, fields) => {
  const updates = Object.keys(fields)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = [...Object.values(fields), id];

  await pool.query(
    `UPDATE patients SET ${updates}, updated_at = NOW() WHERE patient_id = ?`,
    values
  );
};

export const deletePatient = async (id) => {
  await pool.query("DELETE FROM patients WHERE patient_id = ?", [id]);
};
