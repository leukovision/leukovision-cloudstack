import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";
import pool from "../config/db.js";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const generateUserId = customAlphabet(alphabet, 12);

// Ambil Semua User
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT user_id, username, email, full_name FROM users"
    );
    res.status(200).json({ status: "success", data: { users } });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data pengguna",
      error: error.message,
    });
  }
};

// Ambil User Berdasarkan ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const [user] = await pool.query(
      "SELECT user_id, username, email, full_name FROM users WHERE user_id = ?",
      [id]
    );

    if (user.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Pengguna tidak ditemukan." });
    }

    res.status(200).json({ status: "success", data: user[0] });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data pengguna",
      error: error.message,
    });
  }
};

// Tambah User Baru
export const createUser = async (req, res) => {
  const { username, password, email, full_name } = req.body;

  if (!username || !password || !email || !full_name) {
    return res
      .status(400)
      .json({ status: "fail", message: "Semua field harus diisi." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr_${generateUserId()}`;

    await pool.query(
      "INSERT INTO users (user_id, username, password, email, full_name) VALUES (?, ?, ?, ?, ?)",
      [userId, username, hashedPassword, email, full_name]
    );

    res
      .status(201)
      .json({
        status: "success",
        message: "User berhasil dibuat",
        user_id: userId,
      });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal menambahkan user",
      error: error.message,
    });
  }
};

// Update User
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, email, full_name } = req.body;

  try {
    const [user] = await pool.query("SELECT * FROM users WHERE user_id = ?", [
      id,
    ]);

    if (user.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Pengguna tidak ditemukan." });
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : user[0].password;

    await pool.query(
      "UPDATE users SET username = ?, password = ?, email = ?, full_name = ?, updated_at = NOW() WHERE user_id = ?",
      [
        username || user[0].username,
        hashedPassword,
        email || user[0].email,
        full_name || user[0].full_name,
        id,
      ]
    );

    res
      .status(200)
      .json({ status: "success", message: "User berhasil diperbarui." });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui pengguna",
      error: error.message,
    });
  }
};

// Hapus User
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [user] = await pool.query("SELECT * FROM users WHERE user_id = ?", [
      id,
    ]);

    if (user.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Pengguna tidak ditemukan." });
    }

    await pool.query("DELETE FROM users WHERE user_id = ?", [id]);

    res
      .status(200)
      .json({ status: "success", message: "User berhasil dihapus." });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus pengguna",
      error: error.message,
    });
  }
};
