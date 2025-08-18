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
    },
     { timestamps: true }
)

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
},
{timestamps:true})

const Thread = mongoose.model("Thread", threadSchema);
export default Thread;