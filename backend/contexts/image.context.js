export function createImageContext({
  extractedText = "",
  caption = "",
  filename,
  mimetype
}) {
  const hasText = extractedText && extractedText.trim().length > 0;
  const hasCaption = caption && caption.trim().length > 0;

  return {
    type: "image",

    // This is what the LLM will reason over
    content: `
OCR TEXT:
${hasText ? extractedText : "None"}

IMAGE CAPTION:
${hasCaption ? caption : "None"}
`.trim(),

    meta: {
      filename,
      mimetype,
      hasText,
      hasCaption,
      length:
        (extractedText?.length || 0) +
        (caption?.length || 0)
    }
  };
}
