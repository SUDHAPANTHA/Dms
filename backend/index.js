import express from "express"; // this is for ES6 import
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import fs from "fs"; // Import fs module
import multer from "multer";

// Import database connection and models
import connectDB from "./dbconfig/conn.js";
import AdminModel from "./models/admin-model.js";
import UserModel from "./models/user-model.js";
import DocumentCategory from "./models/document-model.js";

const app = express();

// Middleware
app.use(express.json());
// app.use(express.static("public"));
app.use(cors());

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Define your upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Store file with a unique name
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /pdf|doc|docx|txt/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // File type is allowed
  } else {
    cb(new Error("File type is not supported"), false); // Reject file
  }
};

const upload = multer({ storage, fileFilter });


// API to register the user
app.post("/user-register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const checkEmail = await StudentModel.findOne({ email });

    if (checkEmail) {
      return res.status(404).json({ msg: `${email} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = new UserModel({
      email,
      password: hashedPassword,
      name,
    });

    await createUser.save();

    res.status(200).json({
      status: 200,
      msg: "User created successfully",
      data: createUser,
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error!" });
  }
});

// API for user login
app.post("/user-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Password and email both are required" });
    }

    const validateUser = await UserModel.findOne({ email });
    if (!validateUser) {
      return res.status(400).json({ msg: "Email address does not exist" });
    }

    const isMatch = await bcrypt.compare(password, validateUser.password);

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

// API for Admin register
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

    return res.status(200).json({
      msg: "Admin created successfully",
      status: 200,
      data: createAdmin,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// API for admin to get all student details
app.get("/admin-get-user", async (_, res) => {
  try {
    const findAllUser = await UserModel.find();

    if (findAllUser) {
      const totalUser = findAllUser.length;

      const data = findAllUser.map((std) => {
        return {
          id: std._id,
          name: std.name,
          email: std.email,
        };
      });

      return res.status(200).json({
        userdata: data,
        totalUser: totalUser,
        status: 200,
      });
    } else {
      return res.status(400).json({ msg: "No student found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// API for admin login
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

    return res.status(200).json({
      msg: "Login successful",
      status: 200,
      data: findAdmin,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// API to upload document
app.post("/upload-document", upload.single("file"), async (req, res) => {
  try {
    // console.log("Request Body:", req.body);
    // console.log("Uploaded File:", req.file);

    const { title, description, uploadedBy, category, last_modified } =
      req.body;

    if (!title || !description || !uploadedBy || !category || !last_modified) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Validation for duplicate titles
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

    return res.status(200).json({
      status: 200,
      msg: "Document uploaded successfully",
      data: createDocument,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// API to update a document category
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
      return res.status(400).json({ msg: "Document not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});

// API to delete a document category
app.delete("/delete-document/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Document ID is required" });
    }

    const deleteDocument = await DocumentCategory.findByIdAndDelete(id);

    if (deleteDocument) {
      return res.status(200).json({
        msg: "Document deleted successfully",
        data: deleteDocument.title,
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

// API to get all document categories
app.get("/get-all-documents", async (req, res) => {
  try {
    const findAllDocuments = await DocumentCategory.find();

    if (findAllDocuments) {
      return res.status(200).json({
        msg: "Documents retrieved successfully",
        status: 200,
        allDocumentsData: findAllDocuments,
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

// Connection to database
connectDB();

// Start the server
app.listen(3000, () => console.log("Server is running on port 3000"));
