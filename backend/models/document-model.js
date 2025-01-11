import mongoose from "mongoose";
const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["personal", "financial", "education"],
    required: true,
  },
  last_modified: {
    type: Date,
    default: Date.now,
  },
  file: {
    type: String,
    required: true,
  },
});

const DocumentCategory = mongoose.model("Document", DocumentSchema);

export default DocumentCategory;
