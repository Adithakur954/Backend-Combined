// multer.config.js
import multer from "multer";
import path from "path";

// ✅ FIX: Added unique filename to prevent overwriting files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // ✅ Valid upload path
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // ✅ FIX
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)); // ✅ FIX: Safe + unique file name
  }
});

export const upload = multer({ storage });
