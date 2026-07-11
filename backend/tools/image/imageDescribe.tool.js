export async function imageDescribe(context, llm) {
  return llm.chat(
    `Describe the following image content in more descriptive terms and also consider this:\n\n${context}`
  );
}
