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
    ballance: 100, // Default value
  };

  await usersCollection.doc(userId.toString()).set(newUser);
  return newUser;
};

module.exports = { addUser };

// Function to login a user by email and password
// const loginUser = async (usermail, password) => {
//   const snapshot = await usersCollection.where("usermail", "==", usermail).get();

//   if (snapshot.empty) {
//     return null; // No user found
//   }

//   const userDoc = snapshot.docs[0];
//   const user = userDoc.data();

//   if (user.password !== password) {
//     return null; // Incorrect password
//   }

//   return user; // Return the user data if password matches
// };

// module.exports = { loginUser };
