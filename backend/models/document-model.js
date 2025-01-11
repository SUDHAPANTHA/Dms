import mongoose from "mongoose";

// Schema for Document
const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["personal", "financial", "education"], // Limit categories to specific values
      required: true,
    },
    last_modified: {
      type: Date,
      default: Date.now,
    },
    file: {
      type: String, // Path or URL to the uploaded file
      required: true,
    },
  },
);

// Export the model
const Document = mongoose.model("Document", DocumentSchema);

export default Document;
