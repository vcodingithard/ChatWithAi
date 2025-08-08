import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const geminiApiCall = async (message, thread) => {
  try {
    // Extract previous messages from the thread document (if any)
    const messages = thread?.messages || [];

    // Check if this is the first message in the thread
    const isFirstMessage = messages.length === 0;

    // Format the message history into a readable text block for Gemini
    // Example:
    // User: What is JavaScript?
    // Bot: A scripting language for web development.
    const formattedThread = messages
      .map(m => `${m.role === 'user' ? 'User' : 'Bot'}: ${m.content}`)
      .join("\n");

    // Construct the prompt that will be sent to Gemini
    // On first message, also request a short title in the response
    const prompt = `
      ${!isFirstMessage ? `Previous conversation:\n${formattedThread}\n` : ""}
      User message: "${message}"
      Respond to the user.
      ${isFirstMessage ? " Also give a 2-3 word title summarizing the topic." : ""}

      Respond in this JSON format:
      {
        ${isFirstMessage ? `"title": "<short title>",` : ""}
        "response": "<detailed response>"
      }
    `;

    // Send POST request to Gemini API
    const response = await axios.post(
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

    // Extract the raw text output from Gemini's response
    let outputText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    // Remove any surrounding markdown (e.g., ```json) and fix escaped dollar signs
    outputText = outputText
      .replace(/```json|```/g, "")
      .replace(/\\\$/g, "$")
      .trim();

    // Attempt to parse the cleaned output as JSON
    try {
      const parsed = JSON.parse(outputText);
      return parsed;
    } catch (parseError) {
      console.error("❌ Failed to parse Gemini output:", outputText);
      throw new Error("Gemini returned invalid JSON");
    }

  } catch (err) {
    // Handle any errors from the API call
    console.error("Error calling Gemini API:", err.response?.data || err.message);
  }
};

export default geminiApiCall;
