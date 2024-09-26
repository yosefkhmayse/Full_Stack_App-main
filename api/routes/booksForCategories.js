import express from 'express';
const router = express.Router();
import { 
    getBooksForCategories, 
    addBooksForCategory, 
    editBooksForCategory, 
    deleteBooksForCategory,
    getCategoriesWithBooks 
} from '../controllers/booksForCategoriesController.js';

// קבלת ספרים לפי קטגוריות
router.get('/', getBooksForCategories);
// קבלת קטגוריה לפי מזהה
router.get('/:id', getCategoriesWithBooks);
router.post('/', addBooksForCategory); // הוספת ספר לקטגוריה
router.put('/:id', editBooksForCategory); // עדכון ספר בקטגוריה
router.delete('/:id', deleteBooksForCategory); // מחיקת ספר מהקטגוריה

export default router;
