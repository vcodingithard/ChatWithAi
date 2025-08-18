import express from "express";
import passport from "passport";
import User from "../model/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let users = await User.find();
  res.status(200).json(users)
})

// Register
router.post("/register", async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;
  try {
    const user = new User({ name, email, phoneNumber });
    await User.register(user, password); // passport-local-mongoose method
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post("/login",passport.authenticate("local", { failureMessage: "Invalid email or password" }),(req, res) => {
    res.json({
      message: "Login successful",
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
      },
    });
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
