import React from "react";
import {
  FaHome,
  FaUser,
  FaBook,
  FaCalendar,
  FaColumns,
  FaFolder,
  FaRegFileAlt,
  FaList,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function SideBar() {
  return (
    <>
      <nav className="w-64 bg-gradient-to-r from-white via-orange-50 to-white h-screen py-4 px-4">
        <ul className="space-y-4">
          <p className="p-4 text-xl font-bold bg"> Admin Panel</p>
          <Link
            to="/admin-dashboard"
            className="bg-white rounded-xl font-bold flex p-4"
          >
            <FaHome size={20} />{" "}
            <span className="ml-3 font-semibold hover:underline hover:decoration-3">
              Dashboard
            </span>
          </Link>

          <Link
            to="/display-users"
            className="bg-white rounded-xl font-bold flex p-4"
          >
            <FaUsers size={20} />{" "}
            <span className="ml-3 font-semibold hover:underline hover:decoration-3">
              All Users
            </span>
          </Link>

          <Link
            to="/displayalldocs"
            className="bg-white rounded-xl font-bold flex p-4"
          >
            <FaFolder size={20} />{" "}
            <span className="ml-3 font-semibold hover:underline hover:decoration-3">
              All Documents
            </span>
          </Link>
        </ul>
      </nav>
    </>
  );
}

export default SideBar;
