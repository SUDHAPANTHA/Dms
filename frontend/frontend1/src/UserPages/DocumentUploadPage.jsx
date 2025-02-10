import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import UserSideBar from "./UserSideBar";

function DocumentUploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      navigate("/");
      return;
    }
    const { name } = JSON.parse(userData);
    console.log("User name from localStorage:", name); // Debug log
    setUploadedBy(name);
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Only PDF, JPG, and PNG files are allowed!");
        return;
      }
      setFile(selectedFile);
    }
  };

  async function handleUpload(e) {
    e.preventDefault();
    if (!file || !title || !description || !category) {
      toast.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("uploadedBy", uploadedBy);
    formData.append("category", category);
    formData.append("last_modified", new Date().toISOString());

    // Debug log
    console.log("Form Data:");
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const response = await fetch("/proxy/upload-document", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Document uploaded successfully");
        setTitle("");
        setDescription("");
        setCategory("");
        setFile(null);
        navigate("/displayalldocs");
      } else {
        toast.error(data.msg || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong");
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex">
        <UserSideBar />
        <div className="flex-1 p-8">
          <form onSubmit={handleUpload} className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold mb-6">Upload Document</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2"
                required
              >
                <option value="">Select Category</option>
                <option value="Personal">Personal</option>
                <option value="Financial">Financial</option>
                <option value="Education">Education</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Uploaded By
              </label>
              <input
                type="text"
                value={uploadedBy}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-1 block w-full"
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-customOrange text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <FaUpload /> Upload Document
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default DocumentUploadPage;
