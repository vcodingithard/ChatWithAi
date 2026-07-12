import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { uploadToCloudinary } from "./cloudinary.js";

dotenv.config();

// Always write inside uploads/
const uploadsDir = path.join(process.cwd(), "uploads", "images");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const imageTool = {
  async generate(prompt) {
    const modelId = process.env.HF_IMAGE_MODEL || "black-forest-labs/FLUX.1-schnell";
    const res = await fetch(
      `https://router.huggingface.co/hf-inference/models/${modelId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            num_inference_steps: 4,
            guidance_scale: 0
          }
        })
      }
    );

    if (res.status === 503) {
      let details = "The image model is still loading. Please try again in a moment.";
      try {
        const json = await res.json();
        if (json?.estimated_time) {
          details = `The image model is still loading. Please try again in about ${json.estimated_time} seconds.`;
        }
      } catch {
      }
      throw new Error(details);
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Image generation failed with status ${res.status}: ${text}`);
    }

    // SAFETY CHECK — do NOT remove this
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      const text = await res.text();
      throw new Error(`Expected image, got: ${text}`);
    }

    const buffer = await res.arrayBuffer();
    const fileName = `image_${Date.now()}.png`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Upload to Cloudinary and get URL (local file is deleted inside uploadToCloudinary)
    const cloudinaryResult = await uploadToCloudinary(filePath, "generated-images", {
      removeLocalFile: true,
    });

    return {
      type: "image",
      path: cloudinaryResult.secure_url || cloudinaryResult.fallbackUrl || ""
    };
  }
};  