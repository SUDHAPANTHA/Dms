import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <nav className="bg-orange-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Left Side: Just Logo */}
          <div className="flex-grow">
            <span className="text-gray-800 text-lg font-bold">DMS</span>
          </div>

          {/* Right Side: Logout Button */}
          <div>
            <button
              onClick={handleLogout}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
