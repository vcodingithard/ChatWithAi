import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";  
import session from "express-session";
import MongoStore from "connect-mongo";

import User from "./model/User.js";
import chatRoutes from "./routes/chat.js";
import userRoutes from "./routes/user.js"

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------
// Database Connection
// ----------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to Mongo Atlas!'))
  .catch((err) => console.log("❌ Could not connect with the database", err.message));

// ----------------------
// Middlewares
// ----------------------

// Parse incoming JSON requests
app.use(express.json());

// Enable CORS (Cross-Origin Resource Sharing)
// - Allows frontend (http://localhost:5173) to communicate with backend
// - credentials: true allows cookies/sessions to be shared
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Parse URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: true }));

// ----------------------
// Session Management
// ----------------------
// - Stores session in MongoDB using connect-mongo
// - Required for maintaining user login sessions
app.use(session({
  secret: process.env.SESSION_SECRET, // keep this secret in .env
  resave: false,                      // don’t save if nothing changed
  saveUninitialized: false,           // don’t save empty sessions
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGO_URI, 
    ttl: 60 * 60 * 24 * 14            // session expiration: 14 days
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 14, // cookie expiration: 14 days
    httpOnly: true,                   // prevents client-side JS access
    sameSite: "lax",                  // CSRF protection
    secure: false,                    // set to true if using HTTPS
  },
}));

// ----------------------
// Passport Authentication
// ----------------------
// - Passport handles user authentication
// - Using passport-local-mongoose with User model
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());          // Local strategy for login/signup
passport.serializeUser(User.serializeUser()); // Save user data in session
passport.deserializeUser(User.deserializeUser()); // Retrieve user from session

// ----------------------
// Routes
// ----------------------
// All chat-related routes (/api/chat/...)
app.use("/api", chatRoutes);

// All user-related routes (/api/user/...)
app.use("/api/user", userRoutes);

// Default route (sanity check)
app.get("/", (req, res) => {
  res.json("🚀 Server is running");
});

// ----------------------
// Server Listener
// ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
