import Note from "../models/Note.js";

// Staff upload note
export const uploadNote = async (req, res) => {
  const { title, subjectId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "File required" });
  }

  const note = await Note.create({
    title,
    subject: subjectId,
    staff: req.user._id,
    fileUrl: `/uploads/${req.file.filename}`,
  });

  res.status(201).json(note);
};

// Get notes by subject (staff & student)
export const getNotesBySubject = async (req, res) => {
  const { subjectId } = req.params;

  const notes = await Note.find({ subject: subjectId })
    .populate("staff", "name");

  res.json(notes);
};
