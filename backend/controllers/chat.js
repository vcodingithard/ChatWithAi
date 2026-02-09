import geminiApiCall from "../utils/geminiApiCall.js";
import Thread from "../model/Thread.js";


export const getThreads=async (req, res) => {
  try {
    let ownerId = req.user._id.toString();
    // Fetch threads belonging to the user, sorted by last updated
    const threads = await Thread.find({ owner: ownerId }).sort({ updatedAt: -1 });

    if (!threads || threads.length === 0) {
      return res.status(200).json({ message: "You have to make a new chat in order to create a thread" });
    }
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error ${error}` });
  }
}

export const createThread=async (req, res) => {
  let { threadId, message } = req.body;
  let userId = req.user._id.toString();

  // Validate input
  if (!threadId || !message || message.trim() === "") {
    return res.status(400).json("Invalid Input");
  }

  try {
    // Find existing thread by threadId
    let thread = await Thread.findOne({ threadId: threadId });

    // Call Gemini API with the new message and thread context
    const response = await geminiApiCall(message, thread);

    if (!response || !response.response) {
      return res.status(500).json({ message: "Gemini failed to return response" });
    }

    // If thread doesn't exist, create a new one
    if (!thread) {
      thread = new Thread({
        owner: userId,
        threadId: threadId,
        title: response.title, // Gemini provides a title
        messages: [
          { role: "user", content: message },
          { role: "model", content: response.response }
        ],
      });
    } else {
      // If thread exists, push new messages into the thread
      thread.messages.push({ role: "user", content: message });
      thread.messages.push({ role: "model", content: response.response });
    }

    // Save thread to DB
    await thread.save();

    res.status(200).json(response);
  } catch (e) {
    console.error("Gemini API Error:", e.message);
    res.status(500).json({ message: "Error connecting to Gemini API or saving thread" });
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