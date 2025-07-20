import multer from 'multer';
import path from 'path';

// Set storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});

// Validate file type (PDFs only example)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf' || ext === '.docx' || ext === '.png' || ext === '.jpg') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOCX, PNG, JPG files allowed'), false);
  }
};

export const upload = multer({ storage, fileFilter });
