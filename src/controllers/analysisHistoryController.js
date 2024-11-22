import {
  getAllAnalysisHistories,
  getAnalysisHistoryById,
} from "../models/analysisHistoryModel.js";

// Get Semua Analysis History
export const indexAnalysisHistories = async (req, res) => {
  try {
    const histories = await getAllAnalysisHistories();

    if (histories.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Data analysis history belum ada." });
    }

    res.status(200).json({ status: "success", data: { histories } });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat mengambil data",
      error: error.message,
    });
  }
};

// Get Analysis History by ID
export const showAnalysisHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const history = await getAnalysisHistoryById(id);

    if (!history) {
      return res
        .status(404)
        .json({
          status: "fail",
          message: "Data analysis history tidak ditemukan.",
        });
    }

    res.status(200).json({ status: "success", data: history });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat mengambil data",
      error: error.message,
    });
  }
};
