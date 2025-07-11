import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

// --- THIS IS THE FIX ---
// Updated the checkFileType function to include PDFs.
function checkFileType(file, cb) {
  // Allowed extensions for images and PDFs
  const filetypes = /jpeg|jpg|png|gif|webp|pdf/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype || file.mimetype === 'application/pdf' && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Invalid file type. Only images and PDFs are allowed.'), false);
  }
}
// --- END OF FIX ---

// Initialize upload variable with a larger file size limit
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;