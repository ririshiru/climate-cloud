import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function problemController(finalPrompt) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",         // cost-efficient + strong
      messages: [
        {
          role: "system",
          content:
            "You are an expert environment and climate problem analyst. Respond ONLY in valid JSON.",
        },
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      temperature: 0.3,
    });

    const rawOutput = response.choices[0].message.content;

    // Try to parse the output safely
    const cleanJSON = JSON.parse(rawOutput);

    return cleanJSON;

  } catch (err) {
    console.error("❌ Error in problemController:", err.message);
    throw new Error("Failed to generate problems from OpenAI.");
  }
}
