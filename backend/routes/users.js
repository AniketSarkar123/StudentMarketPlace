const express = require("express");
const { addUser } = require("../models/userModel");

const router = express.Router();

// Route: Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, usermail, password } = req.body;

    if (!username || !usermail || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newUser = await addUser(username, usermail, password);
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// module.exports = router;

// Route: Login user
router.post("/login", async (req, res) => {
  try {
    const { usermail, password } = req.body;

    if (!usermail || !password) {
      return res.status(400).json({ error: "Both usermail and password are required" });
    }

    const user = await loginUser(usermail, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        userId: user.userId,
        username: user.username,
        usermail: user.usermail,
        ballance: user.ballance,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;