import express from "express";
import {
  indexAnalysisHistories,
  showAnalysisHistory,
} from "../controllers/analysisHistoryController.js";

const router = express.Router();

router.get("/", indexAnalysisHistories); // Get semua analysis history
router.get("/:id", showAnalysisHistory); // Get analysis history by ID

export default router;
