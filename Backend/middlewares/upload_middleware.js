import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads/products');
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created uploads directory:', uploadDir);
  } catch (error) {
    console.error('Error creating uploads directory:', error);
    throw new Error('Failed to create uploads directory');
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  try {
    // Check file type
    if (!file.mimetype.startsWith('image/')) {
      console.log('Invalid file type:', file.mimetype);
      return cb(new Error('Only image files are allowed!'), false);
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      console.log('File size exceeded:', file.size);
      return cb(new Error('File size exceeds 5MB limit!'), false);
    }

    console.log('File accepted:', file.originalname);
    cb(null, true);
  } catch (error) {
    console.error('Error in file filter:', error);
    cb(error, false);
  }
};

// Create multer instance with error handling
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 5 // Maximum 5 files
  }
});

// Error handling middleware
export const handleUploadError = (err, req, res, next) => {
  console.error('Upload error:', err);
  
  if (err instanceof multer.MulterError) {
    console.log('Multer error code:', err.code);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File size exceeds 5MB limit',
        error: 'FILE_SIZE_LIMIT'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        message: 'Maximum 5 files allowed',
        error: 'FILE_COUNT_LIMIT'
      });
    }
    return res.status(400).json({ 
      message: 'File upload error', 
      error: err.code || 'UPLOAD_ERROR',
      details: err.message
    });
  }
  
  if (err) {
    console.error('General upload error:', err);
    return res.status(400).json({ 
      message: 'File upload error', 
      error: 'UPLOAD_ERROR',
      details: err.message
    });
  }
  
  next();
};

export { upload }; 