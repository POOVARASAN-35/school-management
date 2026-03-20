import Material from "../models/Material.js";

// 👩‍🏫 Staff upload material
export const uploadMaterial = async (req, res) => {
  const { title, subjectId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "File required" });
  }

  const material = await Material.create({
    title,
    fileUrl: `/uploads/${req.file.filename}`,
    subject: subjectId,
    uploadedBy: req.user._id,
  });

  res.status(201).json(material);
};

// 🎓 Student view materials
export const getMaterialsBySubject = async (req, res) => {
  const materials = await Material.find({
    subject: req.params.subjectId,
  }).populate("uploadedBy", "name");

  res.json(materials);
};
