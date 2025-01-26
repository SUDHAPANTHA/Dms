import React from "react";

function DocumentUploadPage() {
  return (
    <>
      <div>
        <form action="">
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            required="required"
          />
          <input
            type="text"
            name="description"
            placeholder="Enter description"
            required="required"
          />
          <input
            type="text"
            name="category"
            placeholder="Enter category"
            required="required"
          />
          <input
            type="date"
            name="last_modified"
            placeholder="Enter last modified date"
            required="required"
          />
          <input
            type="file"
            name="file"
            placeholder="Upload File"
            required="required"
          />
          <input
            type="text"
            name="uploadedBy"
            placeholder="Enter uploaded by"
            required="required"
          />
          <button>Upload</button>
        </form>
      </div>
    </>
  );
}

export default DocumentUploadPage;
