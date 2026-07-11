import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export const llm = {
  async chat(prompt) {
    try {
      console.log("===== LLM REQUEST START =====");
      console.log("Prompt:", prompt);

      const res = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "mcp-text-server"
          },
          body: JSON.stringify({
            model: "openrouter/auto",  // <-- dynamic routing
            messages: [
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0
          })
        }
      );

      console.log("Status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("LLM HTTP ERROR:", errorText);
        throw new Error(`LLM request failed with status ${res.status}`);
      }

      const data = await res.json();

      console.log("Full LLM Response:", JSON.stringify(data, null, 2));

      const content = data?.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("LLM returned no message content");
      }

      console.log("LLM Extracted Content:", content);
      console.log("===== LLM REQUEST END =====");

      return content;

    } catch (err) {
      console.error("LLM CHAT ERROR:", err.message);
      throw err;
    }
  }
};
