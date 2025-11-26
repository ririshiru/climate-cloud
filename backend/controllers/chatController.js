import OpenAI from "openai";
import { supabase } from "../lib/supabase.js";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function chatController(req, res) {
    const { projectId, message } = req.body;

    if (!projectId || !message) {
        return res.status(400).json({ success: false, error: "Missing projectId or message" });
    }

    try {
        // 1. Fetch Project Context
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('title, description, original_problem')
            .eq('id', projectId)
            .single();

        if (projectError || !project) {
            throw new Error("Project not found");
        }

        // 2. Fetch Chat History (Last 10 messages)
        const { data: history, error: historyError } = await supabase
            .from('messages')
            .select('role, content')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true }) // Oldest first for context window
            .limit(20);

        if (historyError) throw historyError;

        // 3. Construct Messages for LLM
        const systemMessage = {
            role: "system",
            content: `You are an AI assistant helping a user with their project titled "${project.title}".
            
            Project Description: ${project.description}
            Original Problem: ${project.original_problem}
            
            Your goal is to help the user develop a solution, refine their ideas, and guide them towards a successful implementation. Be helpful, specific, and encouraging.`
        };

        const messages = [
            systemMessage,
            ...history.map(msg => ({ role: msg.role, content: msg.content })),
            { role: "user", content: message }
        ];

        // 4. Call OpenAI
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
        });

        const aiResponse = response.choices[0].message.content;

        // 5. Save Messages to DB (User + AI)
        const { error: saveError } = await supabase
            .from('messages')
            .insert([
                { project_id: projectId, role: 'user', content: message },
                { project_id: projectId, role: 'assistant', content: aiResponse }
            ]);

        if (saveError) throw saveError;

        // 6. Return Response
        return res.json({ success: true, reply: aiResponse });

    } catch (error) {
        console.error("Chat Controller Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
