import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import fs from "fs";
import { QDRANT_URL, OPENAI_API_KEY } from "../index.js";

const indexingController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "No file uploaded." });
        }

        const pdfPath = req.file.path;

        console.log("📄 Loading PDF:", pdfPath);
        const loader = new PDFLoader(pdfPath);

        // docs = array of pages
        const docs = await loader.load();

        if (docs.length === 0) {
            console.log("❌ No text found in PDF.");
            // Clean up file if needed, though multer might handle it or we leave it for now
            return res.status(400).json({ success: false, error: "No text found in PDF." });
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

        await QdrantVectorStore.fromDocuments(
            docs,
            embeddings,
            {
                url: QDRANT_URL,
                collectionName: "climate-collection", // change as needed
            }
        );

        console.log("✅ PDF embedded and stored in Qdrant successfully!");

        // Optional: Delete the file after processing to save space
        // fs.unlinkSync(pdfPath);

        return res.json({ success: true, message: "PDF indexed successfully.", pages: docs.length });

    } catch (err) {
        console.error("❌ Error in indexingController:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

export default indexingController;
