import { imageTool } from "../../utils/image.client.js";

export async function imageDispatchFromText(context) {
  const imagePath = await imageTool.generate(context.prompt);

  return {
    type: "image",
    path: imagePath.path // because imageTool.generate returns { type: "image", path: url }
  };
}
