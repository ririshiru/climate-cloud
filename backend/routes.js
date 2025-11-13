import express from "express";
import retrieverController from "./controllers/retrieverController.js";
import promptController from "./controllers/promptController.js";
import problemController from "./controllers/problemController.js";

const router = express.Router();

// -------------------------
//        RAG MAIN ROUTE
// -------------------------
router.post("/discover", async (req, res) => {
  try {
    const userQuery = req.body;

    // Step 1: Retrieve relevant chunks from Qdrant
    const retrievedChunks = await retrieverController(userQuery);

    if(!retrievedChunks || retrievedChunks.length === 0) {
      return res.status(500).json({ success: false, error: "Failed to retrieve chunks from Qdrant." });
    }

    // Step 2: Build the final prompt for OpenAI
    const prompt = promptController(userQuery, retrievedChunks);

    if(!prompt) {
      return res.status(500).json({ success: false, error: "Failed to build prompt." });
    }

    // Step 3: Generate problems from LLM
    const problems = await problemController(prompt);

    if(!problems) {
      return res.status(500).json({ success: false, error: "Failed to generate problems." });
    }

    return res.json({
      success: true,
      problems,
    });

  } catch (err) {
    console.error("❌ Error in /discover:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
