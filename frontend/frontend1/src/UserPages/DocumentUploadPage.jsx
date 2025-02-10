import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaUpload } from "react-icons/fa";

function DocumentUploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedBy, setUploadedBy] = useState(""); // Editable field
  const [category, setCategory] = useState("");
  const [lastModified, setLastModified] = useState("");

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
    if (
      !file ||
      !title ||
      !description ||
      !uploadedBy ||
      !category ||
      !lastModified
    ) {
      toast.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("uploadedBy", uploadedBy);
    formData.append("category", category);
    formData.append("last_modified", lastModified);

    try {
      const response = await fetch("/proxy/upload-document", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.status === 200) {
        toast.success("Document uploaded successfully!");
      } else {
        toast.error(data.msg || "Upload failed!");
      }
    } catch (error) {
      console.error("Upload error:", error.message);
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className="flex h-screen justify-center items-center px-8 py-20 bg-gradient-to-r from-white via-orange-200 to-white">
      <form
        onSubmit={handleUpload}
        className="bg-orange-50 p-10 border rounded-lg max-w-md w-full shadow-lg mx-auto"
      >
        <h2 className="font-bold text-2xl text-center mb-4">Upload Document</h2>

        <input
          className="border rounded-lg p-3 w-full mb-2"
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <textarea
          className="border rounded-lg p-3 w-full mb-2"
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />

        <input
          className="border rounded-lg p-3 w-full mb-2"
          type="text"
          placeholder="Uploaded By"
          onChange={(e) => setUploadedBy(e.target.value)}
          value={uploadedBy}
        />

        <select
          className="border rounded-lg p-3 w-full mb-2"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        >
          <option value="">Select Category</option>
          <option value="Personal" name="Personal">
            Personal
          </option>
          <option value="Education" name="Education">
            Education
          </option>
          <option value="Financial" name="Financial">
            Financial
          </option>
          <option value="Others" name="Others">
            Others
          </option>
        </select>

        <input
          className="border rounded-lg p-3 w-full mb-2"
          type="date"
          onChange={(e) => setLastModified(e.target.value)}
          value={lastModified}
        />

        <input
          className="border rounded-lg p-3 w-full mb-2"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />

        <button
          type="submit"
          className="border rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xl p-4 w-full flex justify-center items-center"
        >
          <FaUpload className="mr-2" /> Upload
        </button>
      </form>
    </div>
  );
}

export default DocumentUploadPage;
