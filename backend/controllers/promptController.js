export default function promptController(user, retrievedChunks) {
  // Format retrieved chunks into readable bullet points
  const formattedChunks = retrievedChunks
    .map((chunk, index) => `(${index + 1}) ${chunk.pageContent}`)
    .join("\n\n");

  // Build the final prompt
  return `
You are an expert climate & environmental problem analyst.
Your task is to identify **real, specific, region-relevant problems** that the user can work on.

----------------------
USER PROFILE:
----------------------
- Profession: ${user.profession || "Not provided"}
- Qualification: ${user.qualification || "Not provided"}
- Domain of Interest: ${user.domain || "Not provided"}
- Specific Goal: ${user.specificGoal || "Not provided"}
- Location / Region: ${user.location || "Not provided"}

----------------------
RELEVANT CONTEXT FROM KNOWLEDGE BASE:
----------------------
${formattedChunks}

----------------------
YOUR TASK:
----------------------
Based ONLY on the above user profile & context:

1. Identify **3 high-impact real-world problems** faced in the user's domain & region.
2. Each problem must include:
   - A short title
   - A clear explanation (3–5 lines)
   - Why it matters
   - (Optional) Related UN SDG numbers (if applicable)

3. Problems should be **relevant to the user's qualifications and profession**.

Return ONLY a clean JSON array:
[
  {
    "title": "",
    "description": "",
    "sdgs": [13, 7]
  }
]
  `;
}
