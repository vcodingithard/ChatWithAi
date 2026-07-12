import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

// Make sure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function savePdfTool(text) {
  const fileName = `doc-${Date.now()}.pdf`;
  const filePath = path.join(uploadsDir, fileName);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 50
    });

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(12).text(text, {
      align: "left"
    });

    doc.end();

    stream.on("finish", async () => {
      try {
        // Upload PDF to Cloudinary (it deletes the local temp file)
        const cloudinaryResult = await uploadToCloudinary(filePath, "generated-pdfs", {
          removeLocalFile: true,
        });
        resolve({
          success: true,
          path: cloudinaryResult.secure_url
        });
      } catch (err) {
        reject(err);
      }
    });

    stream.on("error", reject);
  });
}
