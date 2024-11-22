import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers); // Get semua user
router.get("/:id", getUserById); // Get user by ID
router.post("/", createUser); // Tambah user baru
router.put("/:id", updateUser); // Update user
router.delete("/:id", deleteUser); // Hapus user

export default router;
