import express from "express";
import {
  storePatient,
  indexPatients,
  showPatient,
  updatePatientById,
  deletePatientById,
} from "../controllers/patientController.js";

const router = express.Router();

router.post("/", storePatient); // Tambah pasien
router.get("/", indexPatients); // Get semua pasien
router.get("/:id", showPatient); // Get pasien berdasarkan ID
router.put("/:id", updatePatientById); // Update pasien berdasarkan ID
router.delete("/:id", deletePatientById); // Hapus pasien berdasarkan ID

export default router;
