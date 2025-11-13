import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { exec } from "child_process";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.send({ status: "Backend running..." });
});

// Run the indexing (PDF → Qdrant)
app.post("/ingest", (req, res) => {
  exec("node indexing.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
    console.log(stdout);
    res.json({ status: "Indexing complete", logs: stdout });
  });
});

// Placeholder RAG search route
app.post("/search", async (req, res) => {
  const { query } = req.body;

  return res.json({
    message: "RAG search endpoint working...",
    query: query,
  });
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Backend running on http://localhost:3000");
});
