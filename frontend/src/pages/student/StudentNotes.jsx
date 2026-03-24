import React, { useEffect, useState } from "react";
import { fetchNotesBySubject } from "../../api/note.api";
const BASE_URL = "https://school-management-ac64.onrender.com";
const StudentNotes = ({ subjectId }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotesBySubject(subjectId).then((res) =>
      setNotes(res.data)
    );
  }, [subjectId]);

  return (
    <div>
      <h3>Notes</h3>
      <ul>
        {notes.map((n) => (
          <li key={n._id}>
            <a
              href={`${BASE_URL}${n.fileUrl}`}
              target="_blank"
              rel="noreferrer"
            >
              {n.title}
            </a>{" "}
            — {n.staff.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentNotes;
