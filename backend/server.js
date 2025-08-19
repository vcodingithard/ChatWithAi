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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to Mongo Atlas!'))
  .catch((err) => console.log("Could not connect with the database", err.message));

// Body parsers and CORS BEFORE session and passport
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, ttl: 60*60*24*14 }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 14,
    httpOnly: true,
    sameSite: "lax", 
    secure: false,
  },
}));

app.use(passport.initialize());
app.use(passport.session());



app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use("/api", chatRoutes);

app.use("/api/user",userRoutes);

app.get("/", (req, res) => {
  res.json("Server is running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
