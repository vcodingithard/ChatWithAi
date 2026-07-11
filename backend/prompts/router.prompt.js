export function toolRouterPrompt(text) {
  return `
You are a router.
Choose ONE tool: summarize or explain or describe or generate_image or generate_pdf.
Reply with ONLY the tool name considering the text.

Text:
${text}
`;
}
