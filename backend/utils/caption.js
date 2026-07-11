import { pipeline } from "@xenova/transformers";

let captioner = null;

export async function generateImageCaption(imagePath) {
  if (!captioner) {
    captioner = await pipeline(
      "image-to-text",
      "Xenova/vit-gpt2-image-captioning"
    );
  }
  const result = await captioner(imagePath);
  return result?.[0]?.generated_text || "";
}
