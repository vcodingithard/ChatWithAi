import { summarize } from "../tools/text/summarize.tool.js";
import { explain } from "../tools/text/explain.tool.js";
import { describe } from "../tools/text/describe.tool.js";
import { imageSummarize } from "../tools/image/imageSummarize.tool.js";
import { imageExplain } from "../tools/image/imageExplain.tool.js";
import { imageDescribe } from "../tools/image/imageDescribe.tool.js";
import { generatePdf } from "../tools/pdf/generatePdf.tool.js";
import { imageDispatchFromText } from "../tools/text/imageDispatchFromText.js";

export async function textDispatch(tool, context, llm) {
  if (tool === "summarize") return summarize(context, llm);
  if (tool === "explain") return explain(context, llm);
  if (tool === "describe") return describe(context, llm);
  if (tool === "generate_pdf") {
    return {
      type: "pdf_text",
      content: await generatePdf(context, llm)
    };
  }
  if (tool === "generate_image") {
    return imageDispatchFromText({
      prompt: context.content
    });
  }
  throw new Error("Unknown tool: " + tool);
}

export async function imageDispatch(tool, context, llm, userPrompt = "") {
  if (tool === "image_summarize") return imageSummarize(context, llm);
  if (tool === "image_explain") return imageExplain(context, llm);
  if (tool === "image_describe") return imageDescribe(context, llm);
  if (tool === "generate_pdf") {
    return {
      type: "pdf_text",
      content: await generatePdf(context, llm, userPrompt)
    };
  }
  return {
    error: "Unknown tool",
    received: tool
  };
}
