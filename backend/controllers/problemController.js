import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Utility: Clean GPT JSON (remove ```json ``` wrappers)
function extractJSON(text) {
  try {
    // Remove markdown code fences ```json ... ```
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ JSON Parsing Error:", err.message);
    console.log("🔎 Raw Model Response:", text);
    throw new Error("Model did not return valid JSON.");
  }
}

export default async function problemController(finalPrompt) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",          // use mini: cleaner JSON, cheaper, reliable
      messages: [
        {
          role: "system",
          content:
            "You are an expert environmental analyst. Respond ONLY with a valid JSON array. Do NOT use code blocks, do NOT add explanations.",
        },
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      temperature: 0.2,
    });

    const rawOutput = response.choices[0].message.content;

    // Extract clean JSON
    const cleanJSON = extractJSON(rawOutput);

    return cleanJSON;

  } catch (err) {
    console.error("❌ Error in problemController:", err.message);
    throw new Error("Failed to generate problems from OpenAI.");
  }
}