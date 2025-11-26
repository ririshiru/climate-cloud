import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Health Check
app.get("/", (req, res) => {
  res.send({ status: "Backend running..." });
});

// Use routes table
app.use("/api", routes);

// Start Server
app.listen(3000, () => {
  console.log("🚀 Backend running on http://localhost:3000");
});

export const QDRANT_URL = process.env.QDRANT_URL;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
