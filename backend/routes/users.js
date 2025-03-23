const express = require("express");
const { addUser, loginUserByUsername } = require("../models/userModel");

const router = express.Router();

// Route: Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, usermail, password } = req.body;
    
    // Validate required fields
    if (!username || !usermail || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new user
    const newUser = await addUser(username, usermail, password);
    return res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route: Login a user using username and password
router.post("/login", async (req, res) => {
  // Call the loginUserByUsername function from userModel.
  // This function handles validation, setting the cookie, and sending the response.
  return loginUserByUsername(req, res);
});

module.exports = router;
