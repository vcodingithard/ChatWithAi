export async function imageSummarize(context, llm) {
  return llm.chat(
    `Summarize the following text extracted from an image:\n\n${context}`
  );
}
