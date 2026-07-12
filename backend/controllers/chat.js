import fs from "fs/promises";
import path from "path";
import geminiApiCall from "../utils/geminiApiCall.js";
import Thread from "../model/Thread.js";
import { extractTextFromImage } from "../utils/ocr.js";
import { generateImageCaption } from "../utils/caption.js";
import { imageRouterPrompt } from "../prompts/image.prompt.js";
import { imageDispatch } from "../utils/dispatcher.js";
import { llm } from "../utils/llm.client.js";
import { createImageContext } from "../contexts/image.context.js";
import { savePdfTool } from "../tools/pdf/savePdf.tool.js";
import { buildPublicUploadUrl, uploadToCloudinary } from "../utils/cloudinary.js";
import { createTextContext } from "../contexts/text.context.js";
import { toolRouterPrompt } from "../prompts/router.prompt.js";
import { textDispatch } from "../utils/dispatcher.js";

export const getThreads=async (req, res) => {
  try {
    let ownerId = req.user._id.toString();
    // Fetch threads belonging to the user, sorted by last updated
    const threads = await Thread.find({ owner: ownerId }).sort({ updatedAt: -1 });

    if (!threads || threads.length === 0) {
      return res.status(404).json({ message: "You have to make a new chat in order to create a thread" });
    }
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error ${error}` });
  }
}

export const createThread=async (req, res) => {
  let { threadId, message, prompt, input, toolMode, selectedTool } = req.body;
  let userId = req.user._id.toString();
  const userMessage = (message || prompt || input || "").trim();

  // Validate input (require threadId and either a message or an uploaded file)
  if (!threadId || (!userMessage && !req.file)) {
    return res.status(400).json("Invalid Input: threadId and either message or image are required.");
  }

  let imagePath = null;

  try {
    // Find existing thread by threadId
    let thread = await Thread.findOne({ threadId: threadId });

    let modelContent = "";
    let responsePayload = {};
    let userMessageObject = { role: "user", content: userMessage };
    let modelMessageObject = { role: "model" };

    // ----------------------------------------
    // FLOW A: Image Upload Flow
    // ----------------------------------------
    if (req.file) {
      imagePath = req.file.path;
      console.log("Processing uploaded image for thread:", threadId);

      // 1. Run OCR (Tesseract) on local file
      const extractedText = await extractTextFromImage(imagePath);
      console.log("OCR text extracted length:", extractedText?.length || 0);

      // 2. Generate Caption if OCR is empty/blank
      let caption = "";
      const cleanedText = extractedText?.trim();
      if (!cleanedText) {
        try {
          console.log("OCR empty. Generating image caption...");
          caption = await generateImageCaption(imagePath);
          console.log("Caption generated:", caption);
        } catch (err) {
          console.error("Caption generation failed:", err.message);
        }
      }

      // 3. Upload the user image to Cloudinary (local file is deleted on success/failure)
      let uploadedImageUrl = "";
      try {
        console.log("Uploading user image to Cloudinary...");
        const cloudinaryResult = await uploadToCloudinary(imagePath, "uploaded-images", {
          preserveLocalFileOnError: true,
          removeLocalFile: true,
        });
        uploadedImageUrl = cloudinaryResult.secure_url;
        console.log("Uploaded user image to Cloudinary URL:", uploadedImageUrl);
        imagePath = null; // Mark as null so the finally block doesn't try to double-delete
      } catch (err) {
        console.error("Failed to upload user image to Cloudinary:", err.message);
        uploadedImageUrl = buildPublicUploadUrl(req.file.path);
        console.log("Using local fallback image URL:", uploadedImageUrl);
      }

      // 4. Build image context
      const context = createImageContext({
        extractedText,
        caption,
        filename: req.file.originalname,
        mimetype: req.file.mimetype
      });

      // 5. Combine image intelligence + user intent
      const routingInput = `
USER PROMPT:
${userMessage || "None"}

OCR TEXT:
${extractedText || "None"}

IMAGE CAPTION:
${caption || "None"}

FILENAME:
${req.file.originalname}

MIMETYPE:
${req.file.mimetype}
`;

      // 6. Determine tool name (use explicit selection or ask LLM)
      let tool = "auto";
      if (selectedTool && selectedTool !== "auto") {
        if (selectedTool === "summarize") tool = "image_summarize";
        else if (selectedTool === "explain") tool = "image_explain";
        else if (selectedTool === "describe") tool = "image_describe";
        else if (selectedTool === "generate_pdf") tool = "generate_pdf";
        else tool = selectedTool;
      }

      if (tool === "auto") {
        const rawTool = await llm.chat(imageRouterPrompt(routingInput));
        tool = rawTool
          ?.toLowerCase()
          ?.trim()
          ?.replace(/[^a-z_]/g, "");
      }
      console.log("Selected tool name:", tool);

      const safeTool = [
        "image_summarize",
        "image_explain",
        "image_describe",
        "generate_pdf"
      ].includes(tool)
        ? tool
        : "image_explain";

      // 7. Execute the tool dispatcher
      const result = await imageDispatch(
        safeTool,
        context.content,
        llm,
        userMessage
      );

      // 8. Handle tool output side effects
      if (result && result.type === "pdf_text") {
        console.log("Saving PDF text output...");
        const pdf = await savePdfTool(result.content);
        modelContent = `Generated PDF: [Download PDF](${pdf.path})\n\n${result.content}`;
        responsePayload = { tool: safeTool, pdf, response: modelContent };
      } else if (result && result.type === "image") {
        const generatedImageUrl = result.path || "";
        modelContent = `Generated Image:\n![generated image](${generatedImageUrl})`;
        responsePayload = { tool: safeTool, image: generatedImageUrl, response: modelContent };
        modelMessageObject.image = generatedImageUrl;
      } else {
        modelContent = typeof result === "object" ? JSON.stringify(result) : result;
        responsePayload = { tool: safeTool, output: result, response: modelContent };
      }

      // Save image reference in user message
      const imageMarkdown = uploadedImageUrl ? `![Uploaded Image](${uploadedImageUrl})` : "";
      userMessageObject.content = userMessage
        ? [imageMarkdown, userMessage].filter(Boolean).join("\n\n")
        : imageMarkdown || userMessage;
      userMessageObject.image = uploadedImageUrl || "";
      responsePayload = {
        ...responsePayload,
        uploadedImageUrl,
      };

      // Add tool metadata to bot message
      modelMessageObject.content = modelContent;
      modelMessageObject.tool = safeTool;

    // ----------------------------------------
    // FLOW B: Text Tools Flow
    // ----------------------------------------
    } else if (toolMode === "text_tools") {
      console.log("Processing text tool request for thread:", threadId);
      const context = createTextContext(userMessage);

      // Call LLM router to classify and select tool if not explicitly chosen
      let tool = selectedTool;
      if (!tool || tool === "auto") {
        const rawTool = await llm.chat(toolRouterPrompt(context.content));
        tool = rawTool.trim();
      }
      console.log("Classified tool:", tool);

      // Dispatch the tool
      const result = await textDispatch(tool, context, llm);

      if (result && result.type === "pdf_text") {
        const pdf = await savePdfTool(result.content);
        modelContent = `Generated PDF: [Download PDF](${pdf.path})\n\n${result.content}`;
        responsePayload = { tool, pdf, response: modelContent };
      } else if (result && result.type === "image") {
        const generatedImageUrl = result.path || "";
        modelContent = `Generated Image:\n![generated image](${generatedImageUrl})`;
        responsePayload = { tool, image: generatedImageUrl, response: modelContent };
        modelMessageObject.image = generatedImageUrl;
      } else {
        modelContent = typeof result === "object" ? JSON.stringify(result) : result;
        responsePayload = { tool, output: result, response: modelContent };
      }

      modelMessageObject.content = modelContent;
      modelMessageObject.tool = tool;

    // ----------------------------------------
    // FLOW C: Standard Chat Flow
    // ----------------------------------------
    } else {
      console.log("Processing standard chat request for thread:", threadId);
      // Call Gemini API with the new message and thread context
      const response = await geminiApiCall(userMessage, thread);

      if (!response || !response.response) {
        return res.status(500).json({ message: "Gemini failed to return response" });
      }

      modelContent = response.response;
      responsePayload = response;

      modelMessageObject.content = modelContent;
    }

    // Save thread to DB
    if (!thread) {
      let title = "";
      if (responsePayload.title) {
        title = responsePayload.title;
      } else {
        title = userMessage.slice(0, 30) || "Image/Text Query";
      }

      // Safeguard against duplicate titles across the server
      let duplicate = await Thread.findOne({ title: title });
      if (duplicate) {
        title = `${title} (${threadId.slice(0, 5)})`;
      }

      thread = new Thread({
        owner: userId,
        threadId: threadId,
        title: title,
        messages: [userMessageObject, modelMessageObject],
      });
    } else {
      thread.messages.push(userMessageObject);
      thread.messages.push(modelMessageObject);
    }

    await thread.save();

    res.status(200).json(responsePayload);
  } catch (e) {
    console.error("Unified chat API Error:", e.message);
    res.status(500).json({ message: "Error connecting to API or saving thread" });
  } finally {
    // Clean up local temp image if upload failed/was not deleted
    if (imagePath) {
      try {
        await fs.unlink(imagePath);
      } catch {
        // Ignored
      }
    }
  }
}
export const getThreadByid= async (req, res) => {
  try {
    const { threadId } = req.params;
    let ownerId = req.user._id.toString();

    // Find a thread by ID and owner (so users can only fetch their own threads)
    const thread = await Thread.findOne({ threadId: threadId, owner: ownerId });

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    res.status(200).json(thread);
  } catch (error) {
    console.error("Error fetching thread:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export const deleteThreadById=async (req, res) => {
  try {
    const { threadId } = req.params;
    let ownerId = req.user._id.toString();

    // Delete thread only if it belongs to the logged-in user
    const deletedThread = await Thread.findOneAndDelete({
      threadId: threadId,
      owner: ownerId
    });

    if (!deletedThread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    res.status(200).json({ message: "Thread was deleted" });
  } catch (error) {
    console.error("Error deleting thread:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}