import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-white via-orange-200 to-white shadow-md">
      <div className="text-xl font-bold mx-10">Logo</div>
      <div className="space-x-6">
        {user ? (
          <>
            <span className="text-gray-600 font-bold">
              Welcome, {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
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
        )}
      </div>
    </nav>
  );
}

export default NavBar;
