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
} from "react-icons/fa";
import { Link } from "react-router-dom";

function SideBar() {
  return (
    <>
      <nav className="w-64 bg-gradient-to-r from-white via-orange-50 to-white h-screen py-4 px-4">
        <ul className="space-y-4">
          <p className="p-4 text-xl font-bold bg"> Admin Panel</p>
          <li className="bg-white rounded-xl font-bold flex p-4 mt-24">
            <FaHome size={20} />{" "}
            <span className="ml-3 font-semibold hover:underline hover:decoration-3">
              DashBoard
            </span>
          </li>
          <Link
            to="/display-user"
            className="bg-white rounded-xl font-bold flex p-4"
          >
            <FaCalendar size={20} />{" "}
            <span className="ml-3 font-semibold hover:underline hover:decoration-3">
              User List
            </span>
          </Link>

          <Link
            to="/displayalldocs"
            className="bg-white rounded-xl font-bold flex p-4"
          >
            <FaFolder size={20} />{" "}
            <span className="ml-3 font-semibold hover:underline hover:decoration-3">
              All Document
            </span>
          </Link>
        </ul>
      </nav>
    </>
  );
}
export default SideBar;
