import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const geminiApiCall = async (message) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        contents:[{
          role:"user",
          parts:[ {text:`${message}` }]
        }]
},
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": `${process.env.GEMINI_API_KEY}`
        },
      }
    );

    const output = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return output;
  } catch (err) {
    console.error("Error calling Gemini API:", err.response?.data || err.message);
  }
};

export default geminiApiCall;
