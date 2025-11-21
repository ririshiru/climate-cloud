import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import fs from "fs";
// import dotenv from "dotenv/config";
import { QDRANT_URL, OPENAI_API_KEY } from "../index.js";



async function ingestPDF() {
  try {
    // ----------------------------
    // 1. Load PDF
    // ----------------------------
    const pdfPath = "./resource/Resource01.pdf"; // <-- Change PDF here

    if (!fs.existsSync(pdfPath)) {
      console.error("❌ PDF file not found at:", pdfPath);
      process.exit(1);
    }

    console.log("📄 Loading PDF:", pdfPath);
    const loader = new PDFLoader(pdfPath);

    // docs = array of pages
    const docs = await loader.load();

    if (docs.length === 0) {
      console.log("❌ No text found in PDF. Exiting.");
      return;
    }

    console.log(`📄 PDF Loaded → ${docs.length} pages`);

    // ----------------------------
    // 2. Setup embeddings
    // ----------------------------
    const embeddings = new OpenAIEmbeddings({
      apiKey: OPENAI_API_KEY,
      model: "text-embedding-3-large",
    });

    // ----------------------------
    // 3. Push to Qdrant
    // ----------------------------
    console.log("🚀 Connecting to Qdrant...");
    // console.log(`QDRANT_URL: ${process.env.QDRANT_URL}`);/

    const vectorStore = await QdrantVectorStore.fromDocuments(
      docs,
      embeddings,
      {
        url: QDRANT_URL,
        collectionName: "climate-collection", // change as needed
      }
    );

    console.log("✅ PDF embedded and stored in Qdrant successfully!");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

ingestPDF();