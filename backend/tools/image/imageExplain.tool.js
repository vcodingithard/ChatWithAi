export async function imageExplain(context, llm) {
  return llm.chat(
    `Explain the following image content in simple terms and also consider:\n\n${context}`
  );
}
