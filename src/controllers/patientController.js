import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../models/patientModel.js";

// Tambah Pasien Baru
export const storePatient = async (req, res) => {
  const { name, age, gender, address } = req.body;

  if (!name || !age || !gender || !address) {
    return res
      .status(400)
      .json({ status: "fail", message: "Semua field harus diisi." });
  }

  try {
    const patient = await createPatient({ name, age, gender, address });
    res.status(201).json({
      status: "success",
      message: "Pasien berhasil dibuat",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan",
      error: error.message,
    });
  }
};

// Get Semua Pasien
export const indexPatients = async (req, res) => {
  try {
    const patients = await getAllPatients();

    if (patients.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Data pasien belum ada." });
    }

    res.status(200).json({ status: "success", data: { patients } });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan",
      error: error.message,
    });
  }
};

// Get Pasien Berdasarkan ID
export const showPatient = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await getPatientById(id);

    if (!patient) {
      return res
        .status(404)
        .json({ status: "fail", message: "Pasien tidak ditemukan." });
    }

    res.status(200).json({ status: "success", data: patient });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan",
      error: error.message,
    });
  }
};

// Update Pasien
export const updatePatientById = async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, address } = req.body;

  try {
    const patient = await getPatientById(id);

    if (!patient) {
      return res
        .status(404)
        .json({ status: "fail", message: "Pasien tidak ditemukan." });
    }

    // Filter hanya field yang dikirimkan
    const updateFields = {};
    if (name) updateFields.name = name;
    if (age) updateFields.age = age;
    if (gender) updateFields.gender = gender;
    if (address) updateFields.address = address;

    await updatePatient(id, updateFields);

    res
      .status(200)
      .json({ status: "success", message: "Pasien berhasil diperbarui." });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan",
      error: error.message,
    });
  }
};

// Hapus Pasien
export const deletePatientById = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await getPatientById(id);

    if (!patient) {
      return res
        .status(404)
        .json({ status: "fail", message: "Pasien tidak ditemukan." });
    }

    await deletePatient(id);

    res
      .status(200)
      .json({ status: "success", message: "Pasien berhasil dihapus." });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan",
      error: error.message,
    });
  }
};
