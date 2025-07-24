import express from "express";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";
import cors from "cors"
import mongoose from 'mongoose';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to Mongo Atlas!')).catch((err)=>console.log("Could not connect with the database",err.message));


// Middleware
app.use(express.json()); // to parse JSON bodies
app.use(cors())
app.use(express.urlencoded({extended:true}))

// Routes
app.use("/api", chatRoutes);

// Health check route (optional)
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
