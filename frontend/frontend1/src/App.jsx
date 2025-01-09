import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage";
import SideBar from "./components/SideBar";
import DashBoard from "./pages/DashBoard";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sidebar" element={<SideBar />} />
        <Route path="/admin-dashboard" element={<DashBoard />} />
      </Routes>
    </>
  );
}

export default App;
