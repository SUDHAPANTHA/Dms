import React from "react";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-white via-orange-200 to-white shadow-md">
      {/* Left Side: Show "Welcome [User's Name]" after login */}
      <div className="text-xl font-bold mx-10">
        {user ? `Welcome, ${user.name}` : "Logo"}
      </div>

      {/* Right Side: Show either menu or just logout */}
      <div className="space-x-6">
        {!user ? (
          <>
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
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
