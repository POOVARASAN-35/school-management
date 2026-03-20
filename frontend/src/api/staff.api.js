import api from "./axios";

export const fetchMySubjects = () =>
  api.get("/staff/subjects");

export const fetchStudentsBySubject = (subjectId) =>
  api.get(`/staff/subjects/${subjectId}/students`);
