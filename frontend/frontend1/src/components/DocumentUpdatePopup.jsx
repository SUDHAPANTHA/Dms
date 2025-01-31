import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";

function DocumentUpdatePopup({
  close,
  updateDocumentData,
  setUpdateDocumentData,
}) {
  console.log("Updating document: ", updateDocumentData);

  async function updateDocument(e) {
    try {
      e.preventDefault();
      const result = await fetch(
        `/proxy/update-document/${updateDocumentData.id}`,
        {
          headers: { "content-type": "application/json" },
          method: "PATCH",
          body: JSON.stringify(updateDocumentData),
        }
      );
      const data = await result.json();

      if (data) {
        toast.success(data.msg);
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error(error.msg || "Something went wrong");
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-10 flex items-center justify-center">
      <form
        onSubmit={updateDocument}
        className="relative max-w-lg w-full bg-white p-6 rounded-md shadow-md animate-scaleAndIncreaseOpacity"
      >
        <p className="text-xl font-semibold mb-4 text-center">
          Update Document
        </p>

        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            className="p-2 rounded-md border w-full mt-2 outline-none focus:border-blue-500"
            placeholder="Enter document title"
            id="title"
            autoFocus
            value={updateDocumentData.title}
            onChange={(e) =>
              setUpdateDocumentData({
                ...updateDocumentData,
                title: e.target.value,
              })
            }
          />
        </div>

        <div className="mt-2">
          <label htmlFor="uploadedBy">Uploaded By:</label>
          <input
            type="text"
            className="p-2 rounded-md border w-full mt-2 outline-none focus:border-lime-500"
            placeholder="Enter uploader name"
            id="uploadedBy"
            value={updateDocumentData.uploadedBy}
            onChange={(e) =>
              setUpdateDocumentData({
                ...updateDocumentData,
                uploadedBy: e.target.value,
              })
            }
          />
        </div>

        <div className="mt-2">
          <label htmlFor="date">Last Modified Date:</label>
          <input
            type="date"
            className="p-2 rounded-md border w-full mt-2 outline-none focus:border-blue-500"
            id="date"
            value={
              new Date(updateDocumentData.lastModified)
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) =>
              setUpdateDocumentData({
                ...updateDocumentData,
                lastModified: e.target.value,
              })
            }
          />
        </div>

        <div
          onClick={close}
          className="w-fit absolute top-4 right-4 cursor-pointer"
        >
          <RxCross1 size={28} />
        </div>

        <button className="w-full px-2 py-1.5 rounded-md text-white bg-blue-600 hover:bg-blue-700 mt-4">
          Update
        </button>
      </form>
    </div>
  );
}

export default DocumentUpdatePopup;
