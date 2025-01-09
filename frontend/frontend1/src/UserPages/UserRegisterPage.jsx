import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function UserRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function regUser(e) {
    e.preventDefault();
    console.log("Register Form Submitted");
    try {
      const result = await fetch("/proxy/user-register", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await result.json();
      console.log("Server response:", data);
      if (data.status === 200) {
        toast.success(data.msg);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error("Error during registration:", error.message);
      toast.error("Something Went Wrong");
    }
  }

  return (
    <div className="flex h-screen justify-between items-center px-8 py-32 bg-gradient-to-r from-white via-orange-200 to-white">
      <form
        onSubmit={regUser}
        className="bg-orange-50 justify-center items-center p-10 border rounded-lg max-w-md w-full shadow-lg mx-auto"
      >
        <h2 className="font-bold text-2xl text-center">Register Now!</h2>
        <div className="p-2">
          <input
            className="border rounded-lg p-3 w-full"
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <div className="p-2">
          <input
            className="border rounded-lg p-3 w-full"
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="p-2 relative">
          <input
            className="border rounded-lg p-3 w-full"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <span
            className="absolute right-6 top-6 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </span>
        </div>
        <button className="border rounded-lg bg-customOrange text-white font-semibold text-xl p-4 w-full">
          Register
        </button>
      </form>
    </div>
  );
}

export default UserRegisterPage;
