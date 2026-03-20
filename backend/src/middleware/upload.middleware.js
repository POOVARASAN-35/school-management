import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads/pdfs directory exists
const uploadDir = "uploads/pdfs";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Allow more file types
    const allowedExt = ['.pdf', '.doc', '.docx', '.jpg', '.png', '.mp4', '.zip'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} not allowed`));
    }
  },
});

export default upload;