const admin = require("firebase-admin");

// Load the service account key JSON file
const serviceAccount = require("../serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export Firestore instance
const db = admin.firestore();
module.exports = db;
