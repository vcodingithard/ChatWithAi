import express from "express";
import passport from "passport";
import User from "../model/User.js";

const router = express.Router();

router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        phoneNumber: req.user.phoneNumber,
      },
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Get all users (for debugging/admin)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========================
// Register
// ========================
router.post("/signup", async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;
  try {
    const user = new User({ name, email, phoneNumber });
    await User.register(user, password); // passport-local-mongoose handles hashing

    // Optionally log in the user immediately after registration:
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
// Login
// ========================
router.post("/login",
  passport.authenticate("local"),
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
// Logout
// ========================
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
