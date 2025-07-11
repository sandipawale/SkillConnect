import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded.');
  }

  const uploadFromBuffer = () => {
    return new Promise((resolve, reject) => {
      // --- THIS IS THE DEFINITIVE FIX ---
      // Check the file type to determine the upload options
      let resource_type = 'image';
      if (req.file.mimetype === 'application/pdf') {
        resource_type = 'raw'; // For PDFs and other raw files
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'learnify_content', // Use a more generic folder name
          resource_type: resource_type, // Set the resource type dynamically
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      // --- END OF FIX ---
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });
  };

  try {
    const result = await uploadFromBuffer();
    res.status(200).json({
      message: 'File uploaded successfully',
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('Something went wrong with the file upload.');
  }
});

export { uploadImage };