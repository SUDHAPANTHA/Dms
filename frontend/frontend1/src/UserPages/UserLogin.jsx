import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function loginUser(e) {
    e.preventDefault();
    console.log("Login Form Submitted");
    try {
      const response = await fetch("/proxy/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (data.status === 200) {
        localStorage.setItem("user", JSON.stringify(data.data)); // Save user details
        toast.success(data.msg);
        window.location.reload(); // Reload to update navbar
        navigate("/user-dashboard");
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      toast.error("Something Went Wrong");
    }
  }

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-r from-white via-orange-200 to-white">
      <form
        onSubmit={loginUser}
        className="bg-orange-50 p-10 border rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-xl text-center mb-4">User Login</h2>
        <div className="my-4">
          <input
            className="border rounded-xl p-2 w-full"
            type="email"
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="my-4 relative">
          <input
            className="border rounded-xl p-2 w-full"
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </span>
        </div>
        <button className="bg-orange-500 text-white w-full p-2 rounded-md">
          Login
        </button>
      </form>
    </div>
  );
}

export default UserLogin;
