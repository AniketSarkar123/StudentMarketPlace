const db = require("../config/firebase");

// Reference the "items" collection in Firestore
const itemsCollection = db.collection("items");

// Function to add a new item
// The reviews field is left as an empty array.
const addItem = async (category, condition, grade, subject, owner_id, price, images) => {
  const newItem = {
    category,              // string
    condition,             // string
    grade,                 // string
    subject,               // string
    owner_id: Number(owner_id), // number
    price: Number(price),       // number
    images,                // array of strings (URLs)
    reviews: []            // reviews left blank as an empty array
  };

  // Add a new document to the items collection
  const docRef = await itemsCollection.add(newItem);
  return { id: docRef.id, ...newItem };
};

module.exports = { addItem };
