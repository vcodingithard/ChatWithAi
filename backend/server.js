import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";  
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";

import User from "./model/User.js";
import chatRoutes from "./routes/chat.js";
import userRoutes from "./routes/user.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for secure cookies in production (e.g. Render, Vercel)
app.set("trust proxy", 1);

// ----------------------
// Database Connection
// ----------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' Connected to Mongo Atlas!'))
  .catch((err) => console.log(" Could not connect with the database", err.message));

// ----------------------
// Middlewares & CORS Setup
// ----------------------

// Parse incoming JSON requests
app.use(express.json());

// Dynamic CORS Configuration for Production
const frontendUrlEnv = process.env.FRONTEND_URL || "";
const allowedOrigins = frontendUrlEnv
  .split(",")
  .map(url => url.trim())
  .filter(url => url.length > 0);

// Default fallback for local development if environment variable is missing
if (allowedOrigins.length === 0) {
  allowedOrigins.push("http://localhost:5173");
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server requests or tools like Postman (no origin header)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.indexOf(origin) !== -1 || 
                      origin.endsWith(".vercel.app") || 
                      /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
                      /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked] Origin: ${origin}. Allowed origins:`, allowedOrigins);
      callback(null, false); // Avoid passing Error, which triggers Express 500 Internal Server Error
    }
  },
  credentials: true, // Allows cookies/sessions to be shared
}));

// Parse URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ----------------------
// Session Management
// ----------------------
const isProduction = process.env.NODE_ENV === "production";

app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,                      
  saveUninitialized: false,           
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGO_URI, 
    ttl: 60 * 60 * 24 * 14            // 14 days
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
    httpOnly: true,                   // Prevents client-side JS access
    // Production requires 'none' + secure for cross-origin tracking to work across Render & Vercel
    sameSite: isProduction ? "none" : "lax", 
    secure: isProduction,             // true enforces HTTPS in production
  },
}));

// ----------------------
// Passport Authentication
// ----------------------
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());          
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

// ----------------------
// Routes
// ----------------------
app.use("/api", chatRoutes);
app.use("/api/user", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.json(" Server is running");
});

// ----------------------
// Server Listener
// ----------------------
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});