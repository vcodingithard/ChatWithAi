import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const backendBaseUrl = (process.env.BACKEND_URL || process.env.FRONTEND_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/$/, "");

// Configure Cloudinary after dotenv has loaded the environment variables.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function buildPublicUploadUrl(filePath) {
  if (!filePath) return "";

  const normalizedPath = filePath.replace(/\\/g, "/");
  const baseUrl = backendBaseUrl;

  const relativePath = path.isAbsolute(filePath)
    ? path.relative(process.cwd(), filePath).replace(/\\/g, "/")
    : normalizedPath.replace(/^\.\//, "");

  const cleanRelativePath = relativePath.replace(/^\/+/, "");
  if (!cleanRelativePath || cleanRelativePath.startsWith("..")) {
    const fileName = path.basename(normalizedPath);
    return `${baseUrl}/uploads/${fileName}`;
  }

  if (cleanRelativePath.includes("uploads/")) {
    const afterUploads = cleanRelativePath.split("uploads/").slice(1).join("uploads/");
    return `${baseUrl}/uploads/${afterUploads}`;
  }

  if (cleanRelativePath.startsWith("uploads")) {
    return `${baseUrl}/${cleanRelativePath}`;
  }

  return `${baseUrl}/uploads/${path.basename(normalizedPath)}`;
}

/**
 * Uploads a local file to Cloudinary while keeping a local backup so files can still be served.
 * @param {string} localFilePath - Path to the local file
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<object>} Cloudinary upload result or a local fallback result
 */
export async function uploadToCloudinary(localFilePath, folder = "dogpt", options = {}) {
  const preserveLocalFileOnError = options.preserveLocalFileOnError !== false;
  const removeLocalFile = options.removeLocalFile === true;
  const safeFilePath = path.resolve(localFilePath);
  const fallbackUrl = buildPublicUploadUrl(safeFilePath);
  let uploadSucceeded = false;

  await fs.mkdir(path.dirname(safeFilePath), { recursive: true });

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    if (preserveLocalFileOnError) {
      console.warn("Cloudinary credentials are not configured. Using local fallback URL:", fallbackUrl);
      return {
        secure_url: fallbackUrl,
        public_id: null,
        localPath: safeFilePath,
        fallbackUrl,
        savedLocally: true,
      };
    }

    throw new Error("Cloudinary credentials are not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
  }

  try {
    const uploadOptions = {
      folder,
      use_filename: true,
      unique_filename: false,
      type: "upload",
    };

    const fileExtension = path.extname(safeFilePath).toLowerCase();
    if (fileExtension === ".pdf") {
      uploadOptions.resource_type = "raw";
    } else if ([".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"].includes(fileExtension)) {
      uploadOptions.resource_type = "image";
    } else {
      uploadOptions.resource_type = "auto";
    }

    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim();
    if (uploadPreset) {
      uploadOptions.upload_preset = uploadPreset;
    }

    let result;
    try {
      result = await cloudinary.uploader.upload(safeFilePath, uploadOptions);
    } catch (uploadError) {
      const message = uploadError?.message || "";
      if (uploadPreset && /preset|upload preset/i.test(message)) {
        console.warn("Cloudinary upload preset rejected; retrying without preset.");
        delete uploadOptions.upload_preset;
        result = await cloudinary.uploader.upload(safeFilePath, uploadOptions);
      } else {
        throw uploadError;
      }
    }

    uploadSucceeded = true;
    return {
      ...result,
      localPath: safeFilePath,
      fallbackUrl,
      savedLocally: true,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);

    if (preserveLocalFileOnError) {
      console.warn(`Cloudinary upload failed; preserving local file and using local fallback URL: ${fallbackUrl}`);
      return {
        secure_url: fallbackUrl,
        public_id: null,
        localPath: safeFilePath,
        fallbackUrl,
        error: error.message,
        savedLocally: true,
      };
    }

    throw error;
  } finally {
    if (removeLocalFile) {
      try {
        await fs.unlink(safeFilePath);
      } catch (err) {
        console.warn(`Failed to delete temporary local file: ${safeFilePath}`, err.message);
      }
    } else {
      console.log(`Preserved local file for later access: ${safeFilePath}`);
    }
  }
}
