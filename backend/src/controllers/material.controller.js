import Material from "../models/Material.js";

// 👩‍🏫 Staff upload material
export const uploadMaterial = async (req, res) => {
  try {
    const { title, subjectId, description, tags } = req.body;

    const material = await Material.create({
      title,
      description: description || "",
      tags: tags || "",
      fileUrl: `/uploads/pdfs/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      subject: subjectId,
      uploadedBy: req.user._id,
      downloads: 0,
    });

    res.status(201).json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

// 🎓 Student view materials (FIXED)
export const getMaterialsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    console.log("📥 Fetch materials for:", subjectId);

    const materials = await Material.find({
      subject: subjectId,
    }).sort({ createdAt: -1 });

    // ✅ FIX WRONG FILE PATH HERE
    const fixedMaterials = materials.map((m) => {
      let fileUrl = m.fileUrl;

      // If missing /pdfs/ → fix it
      if (!fileUrl.includes("/pdfs/")) {
        fileUrl = `/uploads/pdfs/${fileUrl.split("/").pop()}`;
      }

      return {
        ...m._doc,
        fileUrl,
      };
    });

    res.json(fixedMaterials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch materials" });
  }
};

// ✅ GET ALL MATERIALS (FIX)
export const getAllMaterials = async (req, res) => {
  try {
    console.log("📥 Fetching all materials...");

    const materials = await Material.find()
      .populate("subject", "name")
      .sort({ createdAt: -1 });

    const formatted = materials.map(m => ({
      _id: m._id,
      title: m.title,
      fileName: m.fileUrl.split("/").pop(),
      fileUrl: m.fileUrl,
      subjectId: m.subject?._id,
      subjectName: m.subject?.name,
      createdAt: m.createdAt,
      downloads: m.downloads || 0
    }));

    console.log("✅ Materials count:", formatted.length);

    res.json(formatted);

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: "Failed to load materials" });
  }
};

// 📥 Download Material
// 📥 Download Material - FIXED
export const downloadMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Increment download count
    material.downloads = (material.downloads || 0) + 1;
    await material.save();

    // Fix the file path - remove leading slash
    const filePath = `.${material.fileUrl}`; // This becomes ./uploads/pdfs/filename.pdf
    
    console.log("Attempting to download from:", filePath);

    res.download(filePath, material.fileName || material.fileUrl.split('/').pop(), (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).json({ message: "Download failed" });
      }
    });

  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ message: "Download failed" });
  }
};

// 🗑 Delete Material - FIXED
export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Delete file from uploads folder
    const filePath = `.${material.fileUrl}`; // This becomes ./uploads/pdfs/filename.pdf
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("File deleted from storage");
    }

    // Delete from DB
    await Material.findByIdAndDelete(id);

    res.json({ message: "Material deleted successfully" });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};