const express = require("express");
const { addUser, loginUserByUsername, updateUser } = require("../models/userModel");

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
  return loginUserByUsername(req, res);
});

// New Update Route: Update email, password, and optionally about for the logged-in user
router.put("/update", async (req, res) => {
  try {
    const { email, password, about } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Retrieve user info from cookie
    const rawUserInfo = req.cookies.userInfo;
    if (!rawUserInfo) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const user = JSON.parse(rawUserInfo);
    const userId = user.userId;

    // Update user document
    const updatedUser = await updateUser(userId, email, password, about);
    return res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/email", async (req, res) => {
  try {
    const { userIds } = req.body;
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "A non-empty array of user IDs is required" });
    }
    // Firestore 'in' queries support up to 10 values per query.
    if (userIds.length > 10) {
      return res.status(400).json({ error: "Maximum 10 user IDs allowed per request" });
    }
    
    // Access the "users" collection from Firestore
    const usersCollection = db.collection("users");
    const snapshot = await usersCollection.where("userId", "in", userIds).get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "No users found" });
    }
    const emails = snapshot.docs.map(doc => doc.data().usermail);
    return res.status(200).json({ emails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
