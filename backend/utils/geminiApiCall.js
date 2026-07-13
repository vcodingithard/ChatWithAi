import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// An array of free/least-used models + OpenRouter's universal free router as a fallback
const FREE_MODELS_POOL = [
  "openrouter/free",                      // Universal free auto-router (Highly Recommended)
  "meta-llama/llama-3.2-3b-instruct:free", // Lightweight, less saturated
  "nvidia/nemotron-3-nano-30b-a3b:free",   // Low-latency utility model
  "liquid/lfm-2.5-1.2b-instruct:free"     // Extremely niche/least-used
];

/**
 * Calls OpenRouter to generate a response using a free/least-used model pool.
 */
const geminiApiCall = async (message, thread) => {
  // 1. Extract & Format Thread History
  const messages = thread?.messages || [];
  const isFirstMessage = messages.length === 0;

  const formattedThread = messages
    .map(m => `${m.role === 'user' ? 'User' : 'Bot'}: ${m.content}`)
    .join("\n");

  // 2. Construct the Prompt (Maintaining JSON structure)
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

  // 3. Loop through the free models pool in case of rate limits or failures
  for (const model of FREE_MODELS_POOL) {
    try {
      console.log(`🤖 Attempting completion with model: ${model}`);

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": (process.env.BACKEND_URL || process.env.FRONTEND_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/$/, ""), 
          "X-Title": "mcp-text-server"
        },
        body: JSON.stringify({
          model: model, 
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          response_format: { type: "json_object" } 
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`⚠️ Model ${model} failed (${res.status}). Trying next fallback...`);
        continue; // Proceed to the next model in the array
      }

      const data = await res.json();
      let outputText = data?.choices?.[0]?.message?.content;

      if (!outputText) {
        console.warn(`⚠️ Model ${model} returned empty content. Trying next fallback...`);
        continue;
      }

      // Log which model ended up handling the request (especially useful for openrouter/free)
      console.log(`✅ Success! Processed by: ${data.model || model}`);

      // 4. Clean & Parse JSON Output
      const jsonString = outputText.replace(/```json|```/g, "").trim();
      return JSON.parse(jsonString);

    } catch (err) {
      console.error(`❌ Error with model ${model}:`, err.message);
      // If it's the last model in the pool, throw the error
      if (model === FREE_MODELS_POOL[FREE_MODELS_POOL.length - 1]) {
        throw new Error("All free fallback models failed to resolve the request.");
      }
    }
  }
};

export default geminiApiCall;