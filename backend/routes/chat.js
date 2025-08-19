  import express from "express";
  import geminiApiCall from "../utils/geminiApiCall.js";
  import Thread from "../model/Thread.js";
  const router = express.Router();

  const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };


  router.post("/chat", isLoggedIn, async (req, res) => {
    let { threadId, message } = req.body;
    let userId = req.user_id;
    if (!threadId || !message || message.trim() === "") {
      return res.status(400).json("Invalid Input");
    }
    try {
      let thread = await Thread.findOne({ threadId: threadId });
      const response = await geminiApiCall(message, thread);

      if (!response || !response.response) {
        return res.status(500).json({ message: "Gemini failed to return response" });
      }
      //for a new thread
      if (!thread) {
        thread = new Thread({
          owner: userId,
          threadId: threadId,
          title: response.title,
          messages: [
            { role: "user", content: message },
            { role: "model", content: response.response }
          ],
        });
      } else {
        thread.messages.push({ role: "user", content: message });
        thread.messages.push({ role: "model", content: response.response });
      }
      await thread.save();
      res.status(200).json(response);
    } catch (e) {
      console.error("Gemini API Error:", e.message);
      res.status(500).json({ message: "Error connecting to Gemini API or saving thread" });
    }
  });


  router.get("/thread", isLoggedIn, async (req, res) => {
    try {
      const threads = await Thread.find({ owner: req.user_id}).sort({ updatedAt: -1 });
      if (!threads || threads.length === 0) {
        return res.status(200).json({ message: "you have to make a new chat in order to create a thread" });
      }
      res.status(200).json(threads);
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error ${error}` });
    }
  });

  router.get("/thread/:threadId", isLoggedIn, async (req, res) => {
    try {
      const { threadId } = req.params;
      const thread = await Thread.findOne({ threadId: threadId, owner: req.user_id });
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
      const deletedThread = await Thread.findOneAndDelete({
        threadId: threadId,
        owner: req.user_id
      });
      if (!deletedThread) {
        return res.status(404).json({ message: "Thread not found" });
      }
      res.status(200).json({ message: "Thread was deleted" });
    } catch (error) {
      console.error("Error deleting thread:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  export default router;
