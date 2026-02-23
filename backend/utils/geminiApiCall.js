import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

/**
 * Calls OpenRouter to generate a response for a given user message.
 */
const geminiApiCall = async (message, thread) => {
  try {
    // 1. Extract & Format Thread History
    const messages = thread?.messages || [];
    const isFirstMessage = messages.length === 0;

    const formattedThread = messages
      .map(m => `${m.role === 'user' ? 'User' : 'Bot'}: ${m.content}`)
      .join("\n");

    // 2. Construct the Prompt (Maintaining your JSON structure)
    const prompt = `
      ${!isFirstMessage ? `Previous conversation:\n${formattedThread}\n` : ""}
      User message: "${message}"

      Please respond in a friendly, conversational, and helpful manner.
      Keep your reply simple and professional.

      ${isFirstMessage ? "Also provide a 2-3 word title summarizing the topic." : ""}

      Respond strictly in this JSON format:
      {
        ${isFirstMessage ? `"title": "<short title>",` : ""}
        "response": "<your detailed and crisp response>"
      }
    `;

    // 3. Call OpenRouter API
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
        "X-Title": "mcp-text-server"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001", // Or "openrouter/auto"
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7, // Slightly higher for more "conversational" feel
        response_format: { type: "json_object" } // Forces JSON if the model supports it
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`OpenRouter request failed: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    let outputText = data?.choices?.[0]?.message?.content;

    if (!outputText) throw new Error("No content returned from OpenRouter");

    // 4. Clean & Parse JSON Output
    // Removes markdown code blocks if the model accidentally includes them
    const jsonString = outputText.replace(/```json|```/g, "").trim();
    
    return JSON.parse(jsonString);

  } catch (err) {
    console.error("❌ Error in geminiApiCall (OpenRouter):", err.message);
    throw err;
  }
};

export default geminiApiCall;