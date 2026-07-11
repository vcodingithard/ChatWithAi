import mongoose from "mongoose";

// ----------------------
// Message Schema
// ----------------------
// Represents a single chat message inside a thread.
// - role: Identifies who sent the message ("user" or "model")
// - content: The actual message text
// - timestamps: Automatically adds `createdAt` and `updatedAt`
const messageASchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "model"], // restricts role to only "user" or "model"
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Cloudinary URL of the image, if any
    },
    tool: {
        type: String, // tool name used, if any
    }
}, 
{ timestamps: true }); // auto-manages createdAt & updatedAt fields

// ----------------------
// Thread Schema
// ----------------------
// Represents a full conversation between a user and the model.
// - owner: Reference to the User who owns this thread
// - threadId: Unique identifier for the thread (string, required)
// - title: Short summary/title of the conversation
// - messages: Array of embedded messages (using messageASchema)
// - timestamps: Automatically manages createdAt & updatedAt
const threadSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // links this thread to a specific user
    },
    threadId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true, // ensures no two threads have the same title
        default: "",
    },
    messages: [messageASchema], // embeds chat messages directly inside thread
}, 
{ timestamps: true });

// ----------------------
// Model Export
// ----------------------
// Creates "Thread" model which maps to "threads" collection in MongoDB.
const Thread = mongoose.model("Thread", threadSchema);

export default Thread;
