import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: String,
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
});

const StudentModel = mongoose.model("user", userSchema);

export default UserModel;
