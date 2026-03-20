import React, { useState } from "react";
import { uploadNote } from "../../api/note.api";

const StaffNotes = ({ subjectId }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subjectId", subjectId);
    formData.append("file", file);

    await uploadNote(formData);
    alert("Note uploaded");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <button>Upload</button>
    </form>
  );
};

export default StaffNotes;
