import express from "express";

import { isLoggedIn } from "../middlewares/authMiddleware.js";
import { createThread, deleteThreadById, getThreadByid, getThreads } from "../controllers/chat.js";
import { upload } from "../utils/multer.js";

const router = express.Router();


// ---------------------- CREATE CHAT / ADD MESSAGE ----------------------
router.post("/chat", isLoggedIn, upload.single("image"), createThread);

// ---------------------- GET ALL THREADS OF USER ----------------------
router.get("/thread", isLoggedIn,getThreads );

// ---------------------- GET SINGLE THREAD BY ID ----------------------
router.get("/thread/:threadId", isLoggedIn,getThreadByid);

// ---------------------- DELETE THREAD ----------------------
router.delete("/thread/:threadId", isLoggedIn,deleteThreadById );

export default router;
