import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import dotenv from "dotenv";

dotenv.config();

const QDRANT_URL = process.env.QDRANT_URL;          // example: http://localhost:6333

/**
 * Step 1: Convert user form → one natural language query string
 */
function buildUserQuery(userData) {
  return `
    Profession: ${userData.profession || "unknown"}
    Qualification: ${userData.qualification || "unknown"}
    Domain of interest: ${userData.domain || "climate & environment"}
    Specific Goal: ${userData.specificGoal || "find climate-related problems to work on"}
    User Location: ${userData.location || "global"}

    Based on these details, retrieve the most relevant climate or environmental problems and contextual information from the database.
  `;
}


/**
 * Step 2: Retrieve relevant chunks from Qdrant
 */
export default async function retrieverController(userData) {
  try {
    const userQuery = buildUserQuery(userData);

    // Init embedding model
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-large",
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Connect to existing Qdrant collection
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: QDRANT_URL,
      collectionName: "climate-collection",
    });

    // Extract top 5 most relevant chunks
    const retriever = vectorStore.asRetriever({
      k: 5,
    });

    // Retrieve vector matches
    const relevantChunks = await retriever.invoke(userQuery);

    console.log("🔍 Retrieved Chunks:", relevantChunks.length);

    return relevantChunks;

  } catch (err) {
    console.error("❌ Error in retrieverController:", err);
    throw new Error(err.message);
  }
}
