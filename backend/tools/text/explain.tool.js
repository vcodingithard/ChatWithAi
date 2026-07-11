export async function explain(context, llm) {
  return llm.chat(
    `Explain the following text in simple terms and in a professional approach :\n\n${context.content}`
  );
}
