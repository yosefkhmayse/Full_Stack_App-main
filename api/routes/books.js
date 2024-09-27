import express from 'express';
import multer from 'multer';
import path from 'path';
import { getBooks, getBook, addBook, deleteBook, updateBook, getBookforeditdelete } from '../controllers/bookController.js';

// הגדרת multer להעלאת קבצים
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload'); // תיקייה להעלאת קבצים
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // שם קובץ ייחודי
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// מסלולי ספרים
router.get('/GetBooks/', getBooks);
router.get('/:id', getBook);
router.get('/search/:id', getBookforeditdelete);
router.post('/add', upload.single('image'), addBook);
router.delete('/:id', deleteBook);
router.put('/:id', upload.single('image'), updateBook);

export default router;
