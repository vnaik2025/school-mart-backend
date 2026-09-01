import multer from 'multer';
import { APIError } from '../utils/api-error.js';

// Use memory storage so we can validate file-type from buffer before sending to S3
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  }
});

export const uploadMiddleware = (fieldName = 'image') => {
  return (req, res, next) => {
    const multerUpload = upload.single(fieldName);
    multerUpload(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new APIError('File exceeds maximum size of 5MB', 400));
        }
        return next(new APIError(`Upload error: ${err.message}`, 400));
      }
      next();
    });
  };
};
