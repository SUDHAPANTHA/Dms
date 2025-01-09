import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage";
import SideBar from "./components/SideBar";
import DashBoard from "./pages/DashBoard";
import UserDashBoard from "./UserPages/UserDashBoard";
import UserLogin from "./UserPages/UserLogin";
import NavBar from "./components/NavBar";
import UserSideBar from "./UserPages/UserSideBar";

function App() {
  return (
    <>
      <NavBar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sidebar" element={<SideBar />} />
        <Route path="/user-sidebar" element={<UserSideBar />} />
        <Route path="/admin-dashboard" element={<DashBoard />} />
        <Route path="/user-dashboard" element={<UserDashBoard />} />
        <Route path="/user-login" element={<UserLogin />} />
      </Routes>
    </>
  );
}

export default App;
