// index.js
const express = require("express");
const admin = require("firebase-admin");

// Load the service account key JSON file
const serviceAccount = require("./serviceAccountKey.json");

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Optionally, if you use other Firebase services, you can add additional config here.
});

// Get a Firestore instance
const db = admin.firestore();

// Initialize Express app
const app = express();
const port = 3000;

app.use(express.json());

// Test endpoint to fetch all users from the "users" collection
app.get("/users", async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = [];
    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
