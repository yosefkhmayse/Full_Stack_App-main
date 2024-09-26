import express from 'express';
const router = express.Router();
import { 
    getCategories, 
    addCategory, 
    editCategory, 
    deleteCategory 
} from '../controllers/categoryController.js';

// קבלת כל הקטגוריות
router.get('/', getCategories);
// הוספת קטגוריה
router.post('/', addCategory);
// עדכון קטגוריה לפי מזהה
router.put('/:id', editCategory);
// מחיקת קטגוריה לפי מזהה
router.delete('/:id', deleteCategory);

export default router;
