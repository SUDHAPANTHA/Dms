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
import UserRegisterPage from "./UserPages/UserRegisterPage";
import DocumentUploadPage from "./UserPages/DocumentUploadPage";
import DisplayAllDocument from "./pages/DisplayAllDocument";
import DocumentUpdatePopup from "./components/DocumentUpdatePopup";
import Navbar from "./UserPages/Navbar";
import UserDisplayAllDocument from "./UserPages/UserDisplayAllDocument";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-nav" element={<NavBar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sidebar" element={<SideBar />} />
        <Route path="/user-sidebar" element={<UserSideBar />} />
        <Route path="/admin-dashboard" element={<DashBoard />} />
        <Route path="/user-dashboard" element={<UserDashBoard />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-register" element={<UserRegisterPage />} />
        <Route path="/upload-doc" element={<DocumentUploadPage />} />
        <Route path="/displayalldocs" element={<DisplayAllDocument />} />
        <Route path="/popup" element={<DocumentUpdatePopup />} />
        <Route path="/nav" element={<Navbar />} />
        <Route path="/user-docs" element={<UserDisplayAllDocument />} />
      </Routes>
    </>
  );
}

export default App;
