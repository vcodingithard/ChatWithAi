import express from "express";
import passport from "passport";
import User from "../model/User.js";

const router = express.Router();
router.get("/",async(req,res)=>{
    let users=await User.find();
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
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    // Establish a session
    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({ message: "Login successful", user: { id: user._id, email: user.email, name: user.name } });
    });
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
