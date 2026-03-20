import api from "./axios";

export const uploadNote = (data) =>
  api.post("/notes", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const fetchNotesBySubject = (subjectId) =>
  api.get(`/notes/subject/${subjectId}`);
