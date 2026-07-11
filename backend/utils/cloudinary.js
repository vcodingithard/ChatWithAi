import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a local file to Cloudinary and deletes the local file.
 * @param {string} localFilePath - Path to the local file
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<object>} Cloudinary upload result
 */
export async function uploadToCloudinary(localFilePath, folder = "dogpt") {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: folder,
      resource_type: "auto", // supports image, pdf, etc.
    });
    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    throw error;
  } finally {
    // Always attempt to delete local file to avoid clutter
    try {
      await fs.unlink(localFilePath);
    } catch (err) {
      console.warn(`Failed to delete temporary local file: ${localFilePath}`, err.message);
    }
  }
}
