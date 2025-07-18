import express from "express";
import geminiApiCall from "../utils/geminiApiCall.js";
import Thread from "../model/Thread.js";
const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const response = await geminiApiCall(req.body.message);
    res.status(200).json(response);
  } catch (e) {
    console.error("Gemini API Error:", e.message);
    res.status(500).json({ message: "Error connecting to Gemini API" });
  }
});

router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find().sort({ updatedAt: -1 });
    if (!threads || threads.length === 0) {
      return res.status(404).json({ message: "No threads found" });
    }
    res.status(200).json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/thread/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const thread = await Thread.findOne({threadId:threadId});
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }
    res.status(200).json(thread);
  } catch (error) {
    console.error("Error fetching thread:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.delete("/thread/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const deletedThread = await Thread.findOneAndDelete({threadId:threadId});
    if (!deletedThread) {
      return res.status(404).json({ message: "Thread not found" });
    }
    res.status(200).json({ message: "Thread deleted", thread: deletedThread });
  } catch (error) {
    console.error("Error deleting thread:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
