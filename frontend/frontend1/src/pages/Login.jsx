import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  //Login ko functionality
  async function loginAdmin(e) {
    e.preventDefault();
    console.log("Login Form Submitted");
    try {
      const result = await fetch("/proxy/admin-login", {
        headers: { "Content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await result.json();
      console.log("Server response:", data);
      if (data.status === 200) {
        toast.success(data.msg);
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
    <div className="flex h-screen justify-between items-center px-8 py-32 bg-gradient-to-r from-white via-orange-400 to-white">
      <form
        onSubmit={loginAdmin}
        action=""
        className="bg-blue-400 justify-center items-center p-10 border rounded-lg  max-w-md w-full shadow-lg"
      >
        <h2 className="text-white text-xl text-center">Login Page</h2>
        <div className="my-2">
          <input
            className="border rounded-xl p-2 w-full"
            type="text"
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="my-2">
          <input
            className="border rounded-xl p-2 w-full"
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button className="bg-blue-700 border rounded-md p-2 w-full text-white">
          Login
        </button>
      </form>
    </div>
  );
}
export default Login;
