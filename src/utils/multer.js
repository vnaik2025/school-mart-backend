import multer from 'multer';
import { APIError } from './api-error.js';

// Use memory storage to hold file buffer in memory
// This is necessary because we upload the buffer directly to AWS S3
const storage = multer.memoryStorage();

// File filter to allow only common image formats
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new APIError('Invalid file type. Only JPG, PNG, and WebP are allowed.', 400), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  }
});
