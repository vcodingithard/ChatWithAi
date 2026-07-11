export async function describe(context, llm) {
  return llm.chat(
    `describe the following text for easy understanding and keep the response descriptive:\n\n${context.content}`
  );
}
