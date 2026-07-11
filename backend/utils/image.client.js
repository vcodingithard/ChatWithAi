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
    const res = await fetch(
      "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt
        })
      }
    );

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
    const cloudinaryResult = await uploadToCloudinary(filePath, "generated-images");

    return {
      type: "image",
      path: cloudinaryResult.secure_url
    };
  }
};
