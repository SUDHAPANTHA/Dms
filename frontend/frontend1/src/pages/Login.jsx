import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function loginAdmin(e) {
    e.preventDefault();
    console.log("Login Form Submitted");

    try {
      const result = await fetch("/proxy/admin-login", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await result.json();
      console.log("Server response:", data);

      if (data.status === 200) {
        // Store user details in localStorage
        localStorage.setItem("user", JSON.stringify(data.data));

        toast.success(data.msg);
        navigate("/admin-dashboard");
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
        onSubmit={loginAdmin}
        className="bg-orange-50 p-10 border rounded-lg max-w-md w-full shadow-lg"
      >
        <h2 className="text-xl text-center mb-4">Login Page</h2>

        <div className="my-4">
          <input
            className="border rounded-xl p-2 w-full"
            type="email"
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="my-4 relative">
          <input
            className="border rounded-xl p-2 w-full"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </span>
        </div>

        <button className="bg-orange-500 border rounded-md p-2 w-full text-white">
          Login
        </button>

        <div className="flex justify-between mt-4 text-sm text-gray-600">
          <p className="cursor-pointer">Forgot Password?</p>
          <p className="cursor-pointer" onClick={() => navigate("/user-login")}>
            User Login
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
