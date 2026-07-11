import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(imagePath) {
  const worker = await createWorker('eng');
  const result = await worker.recognize(imagePath);
  await worker.terminate(); // Terminate to release resources
  return result.data.text || "";
}
