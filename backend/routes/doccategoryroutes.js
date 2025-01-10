const express = require("express");
const DocumentCategory = require("../models/document-model");
const router = express.Router();

// Create a new document category
router.post("/document-categories", async (req, res) => {
  const { title, description, uploadedBy } = req.body;

  // Validation
  if (!title || !description || !uploadedBy) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const newCategory = new DocumentCategory({ title, description, uploadedBy });
    const savedCategory = await newCategory.save();
    res.status(201).json({ message: "Document category created successfully", data: savedCategory });
  } catch (err) {
    res.status(500).json({ error: "Failed to create document category", details: err.message });
  }
});

module.exports = router;
