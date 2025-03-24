// const express = require("express");
// const { addItem, getAllItems, editItem } = require("../models/itemsModel");

// const router = express.Router();

// // Route: Add a new item
// router.post("/add", async (req, res) => {
//   try {
//     // Expect all required fields including the new 'name' attribute
//     const { category, condition, grade, subject, name, owner_id, price, images } = req.body;
    
//     // Validate required fields (reviews are not expected from the frontend)
//     if (!category || !condition || !grade || !subject || !name || !owner_id || !price || !images) {
//       return res.status(400).json({ error: "All fields are required" });
//     }
    
//     const newItem = await addItem(category, condition, grade, subject, name, owner_id, price, images);
//     return res.status(201).json({ message: "Item added successfully", item: newItem });
//   } catch (error) {
//     console.error("Error adding item:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Route: Get all items
// router.get("/all", async (req, res) => {
//   try {
//     const items = await getAllItems();
//     return res.status(200).json({ items });
//   } catch (error) {
//     console.error("Error fetching items:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Route: Edit an item identified by its product name
// router.put("/edit", async (req, res) => {
//   try {
//     // The 'name' field will identify the product.
//     // Other fields are optional for updating.
//     const { name, category, condition, grade, subject, owner_id, price, images } = req.body;
//     if (!name) {
//       return res.status(400).json({ error: "Product name is required to identify the item" });
//     }
    
//     // Build an object with only the fields that are provided.
//     const updatedData = {};
//     if (category) updatedData.category = category;
//     if (condition) updatedData.condition = condition;
//     if (grade) updatedData.grade = grade;
//     if (subject) updatedData.subject = subject;
//     if (owner_id) updatedData.owner_id = Number(owner_id);
//     if (price) updatedData.price = Number(price);
//     if (images) updatedData.images = images;
    
//     const updatedItem = await editItem(name, updatedData);
//     return res.status(200).json({ message: "Item updated successfully", item: updatedItem });
//   } catch (error) {
//     console.error("Error editing item:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;
// items.js
const express = require("express");
const { addItem, getAllItems, editItem } = require("../models/itemsModel");
const router = express.Router();

// Route: Add a new item
router.post("/add", async (req, res) => {
  try {
    // Expect all required fields including the new 'name' attribute
    const { category, condition, grade, subject, name, owner_id, price, images } = req.body;
    
    // Validate required fields (reviews are not expected from the frontend)
    if (!category || !condition || !grade || !subject || !name || !owner_id || !price || !images) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const newItem = await addItem(category, condition, grade, subject, name, owner_id, price, images);
    return res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    console.error("Error adding item:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route: Get all items
router.get("/all", async (req, res) => {
  try {
    const items = await getAllItems();
    return res.status(200).json({ items });
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route: Get a single item by id
router.get("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    // Get the document from Firestore using the id
    const docRef = await require("../config/firebase")
      .collection("items")
      .doc(itemId)
      .get();
    if (!docRef.exists) {
      return res.status(404).json({ error: "Item not found" });
    }
    return res.status(200).json({ item: { id: docRef.id, ...docRef.data() } });
  } catch (error) {
    console.error("Error fetching item:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route: Edit an item identified by its product name
router.put("/edit", async (req, res) => {
  try {
    // The 'name' field will identify the product.
    // Other fields are optional for updating.
    const { name, category, condition, grade, subject, owner_id, price, images } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Product name is required to identify the item" });
    }
    
    // Build an object with only the fields that are provided.
    const updatedData = {};
    if (category) updatedData.category = category;
    if (condition) updatedData.condition = condition;
    if (grade) updatedData.grade = grade;
    if (subject) updatedData.subject = subject;
    if (owner_id) updatedData.owner_id = Number(owner_id);
    if (price) updatedData.price = Number(price);
    if (images) updatedData.images = images;
    
    const updatedItem = await editItem(name, updatedData);
    return res.status(200).json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    console.error("Error editing item:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
