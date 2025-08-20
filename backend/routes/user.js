import express from "express";
import passport from "passport";
import User from "../model/User.js";

const router = express.Router();

// ========================
// Middleware: Check if user is logged in
// ========================
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { // Passport adds this helper
    return next(); 
  } else {
    return res.status(401).json({ message: "Not authenticated" }); 
  }
};

// ========================
// Get current logged-in user
// ========================
router.get("/me", isAuthenticated, (req, res) => { 
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      phoneNumber: req.user.phoneNumber,
    },
  });
});

// ========================
// Register new user
// ========================
router.post("/signup", async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;
  try {
    // Create a new user object without password
    const user = new User({ name, email, phoneNumber });

    // passport-local-mongoose adds .register() to handle hashing + saving
    await User.register(user, password); 

    // Auto-login the user right after signup
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging in after registration" });
      }
      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
        },
      });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ========================
// Login existing user
// ========================
router.post(
  "/login",
  passport.authenticate("local"), // Passport handles user verification
  (req, res) => {
    res.json({
      message: "Login successful",
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        phoneNumber: req.user.phoneNumber,
      },
    });
  }
);

// ========================
// Logout current user
// ========================
router.get("/logout", (req, res, next) => {
  req.logout((err) => { // Passport removes req.user and clears session
    if (err) return next(err);
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
