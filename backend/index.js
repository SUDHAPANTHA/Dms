import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import { JsonWebTokenError } from "jsonwebtoken";
import connectDB from "./dbconfig/conn.js";
import AdminModel from "./models/admin-model.js";
const app = express();
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");

exports.authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Check if the token is blacklisted
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res
        .status(401)
        .json({ message: "Token is blacklisted. Please log in again." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

app.use(express.json());
app.use(cors());
//Api For Admin Register
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

    if (createAdmin) {
      return res.status(200).json({
        msg: "Admin create successfully",
        status: 200,
        data: createAdmin,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
});
// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
// Api For Login Admin
app.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "(All Fields Are Required" });
    }
    const findAdmin = await AdminModel.findOne({ email });
    if (!findAdmin) {
      return res.status(200).json({ msg: "Invalid Credential" });
    }
    const isMatch = await bcrypt.compare(password, findAdmin.password);
    if (findAdmin && isMatch) {
      return res
        .status(200)
        .json({ msg: "Login successful", status: 200, data: findAdmin });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server error", err: error.message });
  }
});
// Api for User-Login
// Api For User Registration
//connection function call
connectDB();

app.listen(3000, () => console.log("server is running on port 3000"));
