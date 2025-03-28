const db = require("../config/firebase");

// Firestore collection reference
const usersCollection = db.collection("users");

// Function to get the next auto-incremented userId
const getNextUserId = async () => {
  const snapshot = await usersCollection.orderBy("userId", "desc").limit(1).get();
  if (snapshot.empty) {
    return 1; // Start userId from 1 if no users exist
  }
  return snapshot.docs[0].data().userId + 1;
};

// Function to add a new user
const addUser = async (username, usermail, password) => {
  const userId = await getNextUserId(); // Auto-increment userId
  const newUser = {
    userId,
    username,
    usermail,
    password,
    balance: 100, // Default value
  };

  await usersCollection.doc(userId.toString()).set(newUser);
  return newUser;
};

const loginUserByUsername = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Query the Firestore collection for a document with the given username
    const snapshot = await usersCollection.where("username", "==", username).get();

    // If no user found, return an error
    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    // Assuming usernames are unique, get the first matching document
    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // Verify password
    if (user.password !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Set a cookie with all user information (converted to a JSON string)
    res.cookie("userInfo", JSON.stringify(user), { httpOnly: false });

    // Respond with a success message and the user data
    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// New function to update a user's email, password, and optionally about
const updateUser = async (userId, email, password, about) => {
  const userRef = usersCollection.doc(userId.toString());
  const updateData = { 
    usermail: email,   // updating the email field (using the same field name as in addUser)
    password 
  };
  // Optionally update the about field if provided
  if (about !== undefined) {
    updateData.about = about;
  }
  await userRef.update(updateData);
  const updatedDoc = await userRef.get();
  return updatedDoc.data();
};

// 
// userModel.js
// ... existing code ...

module.exports = { addUser, loginUserByUsername, updateUser, usersCollection: db.collection("users") };

