export const getUserProfile=(req, res) => { 
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      phoneNumber: req.user.phoneNumber,
    },
  });
}



export const signUp=async (req, res) => {
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
}


export const login=(req, res) => {
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