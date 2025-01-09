import React from "react";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      <div className="text-xl font-bold mx-10">Logo</div>
      <div className="space-x-6">
        <a href="#about" className="text-gray-600">
          About
        </a>
        <a href="#features" className="text-gray-600">
          Feature
        </a>
        <a href="#contact" className="text-gray-600">
          Contact
        </a>
        <a href="/user-register" className="text-gray-600">
          Register
        </a>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-orange-500 text-white rounded-md"
        >
          Login
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
