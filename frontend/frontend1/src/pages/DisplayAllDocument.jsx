import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DocumentUpdatePopup from "../components/DocumentUpdatePopup";
import UserSideBar from "../UserPages/UserSideBar";
import Navbar from "../UserPages/Navbar";
import { FaDownload, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function DisplayAllDocument() {
  const [documentData, setDocumentData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [updateDocumentData, setUpdateDocumentData] = useState({
    title: "",
    lastModified: "",
    id: "",
  });

  // Pagination settings
  const documentsPerPage = 5;

  function handlePopup(title, lastModified, id) {
    setIsPopupOpen(!isPopupOpen);
    setUpdateDocumentData({ title, lastModified, id });
  }

  const handlePreview = (filename) => {
    window.open(`/proxy/uploads/${filename}`, '_blank');
  };

  const handleDownload = async (filename, originalName) => {
    try {
      const response = await fetch(`/proxy/uploads/${filename}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = originalName || filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error("Error downloading file");
    }
  };

  async function getDocumentData() {
    try {
      const result = await fetch("/proxy/get-all-documents", {
        headers: { "content-type": "application/json" },
        method: "GET",
      });

      const data = await result.json();

      if (data) {
        // Sort documents by last_modified in descending order (newest first)
        const sortedDocuments = data.allDocumentsData.sort((a, b) => 
          new Date(b.last_modified) - new Date(a.last_modified)
        );
        setDocumentData(sortedDocuments);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  async function deleteDocument(id) {
    try {
      const result = await fetch(`/proxy/delete-document/${id}`, {
        method: "DELETE",
      });

      const data = await result.json();

      if (data) {
        toast.success("Document deleted successfully");
        getDocumentData();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getDocumentData();
  }, []);

  // Filter documents based on search term
  const filteredDocuments = documentData.filter((doc) =>
    searchTerm
      ? doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  // Pagination logic
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = filteredDocuments.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <div className="flex">
        <UserSideBar />
        <div className="flex-1 bg-gray-200/40 h-screen p-4 overflow-y-scroll">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-4xl bg-gradient-to-r from-blue-400 to-purple-400 pb-2 w-fit text-transparent bg-clip-text">
                Display All Documents
              </p>
              <span>
                Total Documents:{" "}
                <span className="font-bold text-2xl">
                  {documentData.length}
                </span>
              </span>
            </div>

            {/* Search Field */}
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded-md w-full max-w-md"
            />

            <table className="w-full table-auto text-white rounded-md shadow-md">
              <thead className="bg-blue-500">
                <tr>
                  <th className="p-2 text-center">Title</th>
                  <th className="p-2 text-center">Category</th>
                  <th className="p-2 text-center">Uploaded By</th>
                  <th className="p-2 text-center">Last Modified</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="text-black">
                {currentDocuments.map((doc) => (
                  <tr key={doc._id} className="bg-white even:bg-gray-200">
                    <td className="p-4 text-center">{doc.title}</td>
                    <td className="p-4 text-center">{doc.category}</td>
                    <td className="p-4 text-center">
                      {doc.uploadedBy || "N/A"}
                    </td>
                    <td className="p-4 text-center">
                      {doc.last_modified
                        ? new Date(doc.last_modified).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="flex justify-center items-center gap-4 p-9">
                      <button
                        onClick={() => deleteDocument(doc._id)}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          handlePopup(doc.title, doc.last_modified, doc._id)
                        }
                        className="bg-lime-500 text-white py-2 my-2 px-4 rounded-lg"
                      >
                        Update
                      </button>
                      {isPopupOpen && (
                        <DocumentUpdatePopup
                          close={handlePopup}
                          updateDocumentData={updateDocumentData}
                          setUpdateDocumentData={setUpdateDocumentData}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                <FaChevronLeft />
              </button>
              
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === index + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DisplayAllDocument;
