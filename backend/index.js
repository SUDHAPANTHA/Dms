import express from "express"; // ES6 import syntax
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";

// Import database connection and models
import connectDB from "./dbconfig/conn.js";
import AdminModel from "./models/admin-model.js";
import UserModel from "./models/user-model.js";
import DocumentCategory from "./models/document-model.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + getFileExtension(file.originalname));
  },
});

function getFileExtension(filename) {
  return "." + filename.split(".").pop();
}

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword"
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
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

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
    const { title, description, uploadedBy, category, last_modified } =
      req.body;
    if (!title || !description || !uploadedBy || !category || !last_modified) {
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
      last_modified: new Date(last_modified),
    });

    await createDocument.save();
    return res.status(200).json({ msg: "Document uploaded successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
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
    const findAllDocuments = await DocumentCategory.find();
    if (findAllDocuments) {
      return res.status(200).json({
        msg: "Documents retrieved successfully",
        allDocumentsData: findAllDocuments,
      });
    } else {
      return res.status(400).json({ msg: "No documents found" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// Connect to database
connectDB();

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
