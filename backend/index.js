import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import AdminModel from "./models/admin-model.js";
import StudentModel from "./models/user-model.js";
import UserModel from "./models/user-model.js";
import connectDB from "./dbconfig/conn.js";
const app = express();
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
app.post("/user-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "(All Fields Are Required" });
    }
    const findUser = await StudentModel.findOne({ email });
    if (!findUser) {
      return res.status(200).json({ msg: "Invalid Credential" });
    }
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (findUser && isMatch) {
      return res
        .status(200)
        .json({ msg: "Login successful", status: 200, data: findUser });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server error", err: error.message });
  }
});
// Api For User Registration
app.post("/user-register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const checkEmail = await UserModel.findOne({ email });

    if (checkEmail) {
      return res.status(404).json({ msg: `${email} already exists` });
    }

    //hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user code
    const createUser = new UserModel({
      email,
      password: hashedPassword,
      name,
    });

    await createUser.save();

    if (createUser) {
      res.status(200).json({
        status: 200,
        msg: "user created successfully",
        data: createUser,
      });
    } else {
      res.status(400).json({ msg: "failed to create user" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal server error!" });
  }
});

//connection function call
connectDB();

app.listen(3000, () => console.log("server is running on port 3000"));
