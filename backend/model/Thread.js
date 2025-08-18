import mongoose from "mongoose"

const messageASchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "model"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    }
})

const threadSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    threadId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
        default: "",
    },
    messages: [messageASchema],
    createdAt: {
        type: Date,
        default: Date.now,

    },
    updatedAt: {
        type: Date,
        default: Date.now,

    }
})

const Thread = mongoose.model("Thread", threadSchema);
export default Thread;