import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DocumentUpdatePopup from "../components/DocumentUpdatePopup";

function DisplayAllDocument() {
  const [documentData, setDocumentData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
        console.log(data);
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

  return (
    <>
      <div className="bg-gray-200/40 h-screen p-4 overflow-y-scroll">
        <div className="flex items-center justify-between">
          <p className="font-bold text-4xl bg-gradient-to-r from-blue-400 to-purple-400 pb-2 w-fit text-transparent bg-clip-text">
            Display All Documents
          </p>
          <span>
            Total Documents:{" "}
            <span className="font-bold text-2xl">{documentData.length}</span>
          </span>
        </div>

        <table className="w-full table-auto text-white mt-4 rounded-md shadow-md">
          <thead className="bg-blue-500">
            <tr>
              <th className="p-2 text-center">Title</th>
              <th className="p-2 text-center">Category</th>
              <th className="p-2 text-center">Last Modified</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="text-black">
            {documentData.map((doc) => (
              <tr key={doc._id} className="bg-white even:bg-gray-200">
                <td className="p-4 text-center">{doc.title}</td>
                <td className="p-4 text-center">{doc.category}</td>
                <td className="p-4 text-center">
                  {doc.lastModified && !isNaN(Date.parse(doc.lastModified))
                    ? new Date(doc.lastModified).toLocaleString()
                    : new Date().toLocaleString()}
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
                      handlePopup(doc.title, doc.lastModified, doc._id)
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
    </>
  );
}

export default DisplayAllDocument;
