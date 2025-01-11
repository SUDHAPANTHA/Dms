import express from "express"; // For ES6 import
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import multer from "multer";

// Import database connection and models
import connectDB from "./dbconfig/conn.js";
import StudentModel from "./models/user-model.js";
import AdminModel from "./models/admin-model.js";
import UserModel from "./models/user-model.js";
import DocumentCategory from "./models/document-model.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /pdf|doc|docx|txt/;
    const extname = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only .pdf, .doc, .docx, .txt formats are allowed!"));
    }
  },
});

// Home Page API
app.get("/home", (req, res) => {
  res.send("This is the home page");
});

// Product Page API
app.get("/product/page", (req, res) => {
  res.json({ msg: "Product page" });
});

// User Registration API
app.post("/user-register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await StudentModel.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ msg: `${email} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ email, password: hashedPassword, name });
    await newUser.save();

    res.status(200).json({
      status: 200,
      msg: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error!" });
  }
});

// User Login API
app.post("/user-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email address not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    return res.status(200).json({ msg: "Login successful", status: 200 });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error!", err: error.message });
  }
});

// Admin Registration API
app.post("/admin-register", async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new AdminModel({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
    });

    await newAdmin.save();

    return res.status(200).json({
      msg: "Admin created successfully",
      status: 200,
      data: newAdmin,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// Admin Get All Users API
app.get("/admin-get-user", async (_, res) => {
  try {
    const allUsers = await UserModel.find();

    if (allUsers) {
      const userData = allUsers.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
      }));

      return res.status(200).json({
        userdata: userData,
        totalUsers: allUsers.length,
        status: 200,
      });
    } else {
      return res.status(400).json({ msg: "No users found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// Admin Login API
app.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ msg: "Invalid email address" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    return res.status(200).json({
      msg: "Login successful",
      status: 200,
      data: admin,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// Document Upload API
app.post("/upload-document", upload.single("file"), async (req, res) => {
  try {
    const { title, content, uploadedBy, category, last_modified } = req.body;

    if (!title || !content || !uploadedBy || !category || !last_modified) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingDocument = await DocumentCategory.findOne({ title });
    if (existingDocument) {
      return res.status(402).json({ msg: `${title} already exists` });
    }

    const newDocument = new DocumentCategory({
      title,
      content,
      uploadedBy,
      category,
      file: req.file.filename,
      last_modified: new Date(last_modified),
    });

    await newDocument.save();

    return res.status(200).json({
      status: 200,
      msg: "Document uploaded successfully",
      data: newDocument,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// Document Update API
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
      return res.status(200).json({
        msg: "Document updated successfully",
        status: 200,
        data: updatedDocument,
      });
    } else {
      return res.status(404).json({ msg: "Document not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// Document Deletion API
app.delete("/delete-document/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Document ID is required" });
    }

    const deletedDocument = await DocumentCategory.findByIdAndDelete(id);
    if (deletedDocument) {
      return res.status(200).json({
        msg: "Document deleted successfully",
        data: deletedDocument.title,
      });
    } else {
      return res.status(404).json({ msg: "Document not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// Get All Documents API
app.get("/get-all-documents", async (req, res) => {
  try {
    const documents = await DocumentCategory.find();

    if (documents) {
      return res.status(200).json({
        msg: "Documents retrieved successfully",
        status: 200,
        allDocumentsData: documents,
      });
    } else {
      return res.status(400).json({ msg: "No documents found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// Connect to Database
connectDB();

// Start the Server
app.listen(3000, () => console.log("Server is running on port 3000"));
