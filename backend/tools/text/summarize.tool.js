export async function summarize(context, llm) {
  return llm.chat(
    `Summarize the following text:\n\n${context.content}`
  );
}
