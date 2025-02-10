import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DocumentUpdatePopup from "../components/DocumentUpdatePopup";
import UserSideBar from "../UserPages/UserSideBar";
import Navbar from "../UserPages/Navbar";

function DisplayAllDocument() {
  const [documentData, setDocumentData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [updateDocumentData, setUpdateDocumentData] = useState({
    title: "",
    lastModified: "",
    id: "",
  });

  function handlePopup(title, lastModified, id) {
    setIsPopupOpen(!isPopupOpen);
    setUpdateDocumentData({ title, lastModified, id });
  }

  async function getDocumentData() {
    try {
      const result = await fetch("/proxy/get-all-documents", {
        headers: { "content-type": "application/json" },
        method: "GET",
      });

      const data = await result.json();

      if (data) {
        console.log("Document Data:", data.allDocumentsData); // Debug log
        setDocumentData(data.allDocumentsData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  async function deleteDocument(id) {
    try {
      const result = await fetch(`/proxy/delete-document/${id}`, {
        headers: { "content-type": "application/json" },
        method: "DELETE",
      });

      const response = await result.json();

      if (response) {
        toast.success(response.msg);
        setDocumentData((prevDocumentData) =>
          prevDocumentData.filter((doc) => doc._id !== id)
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  }

  useEffect(() => {
    getDocumentData();
  }, []);

  // Filter documents based on search term (title or category)
  const filteredDocuments = documentData.filter((doc) =>
    searchTerm
      ? doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

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
                {filteredDocuments.map((doc) => (
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
          </div>
        </div>
      </div>
    </>
  );
}

export default DisplayAllDocument;
