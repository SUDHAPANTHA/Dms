import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectDB from "./dbconfig/conn.js";
import AdminModel from "./models/admin-model.js";
import UserModel from "./models/user-model.js";
import DocumentCategory from "./models/document-model.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Define upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /pdf|doc|docx|txt/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Allow file
  } else {
    cb(new Error("File type is not supported"), false); // Reject file
  }
};

const upload = multer({ storage, fileFilter });

// Authentication Middleware
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid Token" });
  }
};

// API Routes
app.get("/home", (req, res) => res.send("This is home page"));
app.get("/product/page", (req, res) => res.json({ msg: "Product page" }));

// User Registration
app.post("/user-register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const checkEmail = await UserModel.findOne({ email });
    if (checkEmail)
      return res.status(400).json({ msg: `${email} already exists` });

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = new UserModel({ email, password: hashedPassword, name });
    await createUser.save();

    res
      .status(201)
      .json({ msg: "User created successfully", user: createUser });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", err: error.message });
  }
});

// User Login
app.post("/user-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const validateUser = await UserModel.findOne({ email });
    if (!validateUser)
      return res.status(400).json({ msg: "Email does not exist" });

    const isMatch = await bcrypt.compare(password, validateUser.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: validateUser._id, name: validateUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res
      .status(200)
      .json({ msg: "Login successful", token, user: validateUser });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// Upload Document
app.post(
  "/upload-document",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, description, category, last_modified } = req.body;

      if (!title || !description || !category || !last_modified) {
        return res.status(400).json({ msg: "All fields are required" });
      }

      const checkIfDocumentExists = await DocumentCategory.findOne({ title });
      if (checkIfDocumentExists)
        return res.status(400).json({ msg: `${title} already exists` });

      const createDocument = new DocumentCategory({
        title,
        description,
        uploadedBy: req.user.name, // Store logged-in user's name
        category,
        file: req.file.filename,
        last_modified: new Date(last_modified),
      });

      await createDocument.save();

      return res
        .status(201)
        .json({
          msg: "Document uploaded successfully",
          document: createDocument,
        });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Internal server error", err: error.message });
    }
  }
);

// Get All Documents
app.get("/get-all-documents", async (req, res) => {
  try {
    const findAllDocuments = await DocumentCategory.find();

    if (findAllDocuments.length === 0) {
      return res.status(404).json({ msg: "No documents found" });
    }

    const documentsWithFileURL = findAllDocuments.map((doc) => ({
      ...doc._doc,
      fileURL: `http://localhost:3000/uploads/${doc.file}`,
    }));

    return res
      .status(200)
      .json({
        msg: "Documents retrieved successfully",
        documents: documentsWithFileURL,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// Update Document
app.patch("/update-document/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "Document ID is required" });

    const updatedDocument = await DocumentCategory.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (updatedDocument)
      return res
        .status(200)
        .json({
          msg: "Document updated successfully",
          document: updatedDocument,
        });
    return res.status(404).json({ msg: "Document not found" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// Delete Document
app.delete("/delete-document/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "Document ID is required" });

    const deleteDocument = await DocumentCategory.findByIdAndDelete(id);
    if (deleteDocument)
      return res
        .status(200)
        .json({
          msg: "Document deleted successfully",
          document: deleteDocument,
        });
    return res.status(404).json({ msg: "Document not found" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// Connect to Database and Start Server
connectDB();
app.listen(3000, () => console.log("Server is running on port 3000"));
