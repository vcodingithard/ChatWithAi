import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file (for GEMINI_API_KEY)
dotenv.config();

/**
 * Calls Google's Gemini API to generate a response for a given user message.
 * 
 * @param {string} message - The latest message from the user.
 * @param {Object} thread - The chat thread object containing previous messages.
 * @returns {Object} JSON object with Gemini's response (and title if it's the first message).
 * 
 * Expected return format:
 * {
 *   "title": "Short Title",   // only included in the first message
 *   "response": "Bot's detailed response"
 * }
 */
const geminiApiCall = async (message, thread) => {
  try {
    // ----------------------
    // Extract & Format Thread
    // ----------------------

    // Get previous messages from the thread (if any exist)
    const messages = thread?.messages || [];

    // Identify if this is the first message in the thread
    const isFirstMessage = messages.length === 0;

    // Format previous conversation history into readable dialogue
    // Example:
    // User: What is JavaScript?
    // Bot: A scripting language for web development.
    const formattedThread = messages
      .map(m => `${m.role === 'user' ? 'User' : 'Bot'}: ${m.content}`)
      .join("\n");

    // ----------------------
    // Construct Gemini Prompt
    // ----------------------

    // Prompt includes:
    //  - Conversation history (if available)
    //  - The latest user message
    //  - Instructions to respond like ChatGPT
    //  - JSON response format requirement
    //  - If it's the first message, also request a short title
    const prompt = 
    `${!isFirstMessage ? `Previous conversation:\n${formattedThread}\n` : ""}
      User message: "${message}"

      Please respond in a friendly, conversational, and helpful manner just like ChatGPT would. 
      Keep your reply simple, professional.

      ${isFirstMessage ? "Also provide a 2-3 word title summarizing the topic." : ""}

      Respond strictly in this JSON format:
      {
        ${isFirstMessage ? `"title": "<short title>",` : ""}
        "response": "<your detailed and crisp response>"
      }`;

    // ----------------------
    // Call Gemini API
    // ----------------------

    const response = await axios.post(
      // Endpoint for Gemini text generation
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }]
      },
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    // ----------------------
    // Process API Response
    // ----------------------

    // Extract raw text output from Gemini's response structure
    let outputText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    // Clean output:
    // - Remove code block markers (```json)
    // - Fix escaped dollar signs (e.g., \$ → $)
    outputText = outputText
      .replace(/```json|```/g, "")
      .replace(/\\\$/g, "$")
      .trim();

    // ----------------------
    // Parse JSON
    // ----------------------

    try {
      // Attempt to parse Gemini's response into JSON
      const parsed = JSON.parse(outputText);
      return parsed;
    } catch (parseError) {
      // If Gemini returns invalid JSON, log and throw error
      console.error("❌ Failed to parse Gemini output:", outputText);
      throw new Error("Gemini returned invalid JSON");
    }

  } catch (err) {
    // Catch any API/network errors and log for debugging
    console.error("Error calling Gemini API:", err.response?.data || err.message);
  }
};

export default geminiApiCall;
