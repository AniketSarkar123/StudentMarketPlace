const express = require("express");
const { addItem } = require("../models/itemsModel");

const router = express.Router();

// Route: Add a new item
router.post("/add", async (req, res) => {
  try {
    const { category, condition, grade, subject, owner_id, price, images } = req.body;
    
    // Validate required fields (reviews are not expected from the frontend)
    if (!category || !condition || !grade || !subject || !owner_id || !price || !images) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const newItem = await addItem(category, condition, grade, subject, owner_id, price, images);
    return res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    console.error("Error adding item:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
