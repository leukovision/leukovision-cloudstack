import express from "express";
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import analysisHistoryRoutes from "./routes/analysisHistoryRoutes.js";

const app = express();

// Middleware
app.use(express.json()); // Parsing JSON

// Prefix API Routes
app.use("/api/users", userRoutes); // Semua endpoint user akan memiliki prefix /api/users
app.use("/api/patients", patientRoutes);
app.use("/api/analysis_history", analysisHistoryRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
