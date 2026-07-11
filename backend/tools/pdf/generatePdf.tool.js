export async function generatePdf(context, llm, userPrompt = "") {
  const contextStr = typeof context === "object" ? (context.content || JSON.stringify(context)) : context;
  return llm.chat(`
You are generating content for a PDF document.

Rules:
- Write clean, structured text
- Use paragraphs
- No markdown
- No emojis
- No explanations about yourself
- Make it professional and ready to export

User Instruction:
${userPrompt || "Generate a structured document based on the image content."}

Image Context:
${contextStr}

Generate the final PDF-ready document text.
`);
}
