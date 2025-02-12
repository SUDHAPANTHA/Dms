import express from "express"; // ES6 import syntax
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import database connection and models
import connectDB from "./dbconfig/conn.js";
import AdminModel from "./models/admin-model.js";
import UserModel from "./models/user-model.js";
import DocumentCategory from "./models/document-model.js";

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Document Schema
// const DocumentSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   uploadedBy: {
//     type: String,
//     required: true,
//   },
//   category: {
//     type: String,
//     enum: ["Personal", "Financial", "Education", "Others"],
//     required: true,
//   },
//   file: {
//     type: String,
//     required: true,
//   },
//   last_modified: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const DocumentCategory = mongoose.model("Document", DocumentSchema);

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// User Registration API
app.post("/user-register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const checkEmail = await UserModel.findOne({ email });
    if (checkEmail) {
      return res.status(404).json({ msg: `${email} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = new UserModel({ email, password: hashedPassword, name });

    await createUser.save();
    res
      .status(200)
      .json({ msg: "User created successfully", data: createUser });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error!" });
  }
});

// User Login API
app.post("/user-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Both fields are required" });
    }

    const validateUser = await UserModel.findOne({ email });
    if (!validateUser) {
      return res.status(400).json({ msg: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, validateUser.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }
    return res.status(200).json({
      status: 200,
      msg: "Login successful",
      user: {
        name: validateUser.name,
        email: validateUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error!" });
  }
});

// Admin Registration API
app.post("/admin-register", async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createAdmin = new AdminModel({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
    });
    await createAdmin.save();
    return res.status(200).json({ msg: "Admin created successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// Upload Document API
app.post("/upload-document", upload.single("file"), async (req, res) => {
  try {
    const { title, description, uploadedBy, category } = req.body;

    if (!title || !description || !uploadedBy || !category || !req.file) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const checkIfDocumentExists = await DocumentCategory.findOne({ title });
    if (checkIfDocumentExists) {
      return res.status(402).json({ msg: `${title} already exists` });
    }

    const createDocument = new DocumentCategory({
      title,
      description,
      uploadedBy,
      category,
      file: req.file.filename,
      last_modified: new Date(),
    });

    await createDocument.save();
    return res.status(200).json({ msg: "Document uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});
app.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const findAdmin = await AdminModel.findOne({ email });

    if (!findAdmin) {
      return res.status(200).json({ msg: "Invalid Email address" });
    }

    const isMatch = await bcrypt.compare(password, findAdmin.password);

    if (!isMatch) {
      return res.status(200).json({ msg: "Invalid Credentials" });
    }
    if (findAdmin && isMatch) {
      return res
        .status(200)
        .json({ msg: "Login successful", status: 200, data: findAdmin });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});
// Update Document API
app.patch("/update-document/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ msg: "Document ID is required" });
    }

    const updatedDocument = await DocumentCategory.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (updatedDocument) {
      return res
        .status(200)
        .json({ msg: "Document updated successfully", data: updatedDocument });
    } else {
      return res.status(400).json({ msg: "Document not found" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// Delete Document API
app.delete("/delete-document/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ msg: "Document ID is required" });
    }

    const deleteDocument = await DocumentCategory.findByIdAndDelete(id);
    if (deleteDocument) {
      return res.status(200).json({ msg: "Document deleted successfully" });
    } else {
      return res.status(404).json({ msg: "Document not found" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// Get All Documents API
app.get("/get-all-documents", async (req, res) => {
  try {
    const allDocumentsData = await DocumentCategory.find({});
    res.status(200).json({ allDocumentsData });
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Get All Users API
app.get("/get-all-users", async (req, res) => {
  try {
    const users = await UserModel.find({}, "-password");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Update user
app.put("/update-user/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    await UserModel.findByIdAndUpdate(req.params.id, { name, email });
    res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Delete user
app.delete("/delete-user/:id", async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Connect to database
connectDB();

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
