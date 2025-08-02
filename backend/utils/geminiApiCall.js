import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const geminiApiCall = async (message) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        contents: [{
          role: "user",
          parts: [{
            text: `Reply to the user's message and also give a 2-3 word title summarizing the topic.
            
User message: "${message}"

Respond in this JSON format:
{
  "title": "<short title>",
  "response": "<detailed response>"
}`
          }]
        }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": `${process.env.GEMINI_API_KEY}`
        }
      }
    );

    let outputText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    // Remove markdown formatting like ```json ... ```
    outputText = outputText.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(outputText);
    return parsed; // { title: "...", response: "..." }
    
  } catch (err) {
    console.error("Error calling Gemini API:", err.response?.data || err.message);
  }
};

export default geminiApiCall;
