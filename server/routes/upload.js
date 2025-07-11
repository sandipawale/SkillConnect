import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';
import uploadMiddleware from '../middleware/upload.js'; // Import the middleware config
import { protect } from '../middleware/auth.js';

const router = express.Router();

// This is a more robust way to handle multer errors like file size limits
const handleUpload = (req, res, next) => {
  const upload = uploadMiddleware.single('image');

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading (e.g., file too large)
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File is too large. Maximum size is 10MB.' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ message: err.message });
    }
    // Everything went fine, proceed to the next function.
    next();
  });
};

router.post('/', protect, handleUpload, uploadImage);

export default router;