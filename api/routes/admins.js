import express from 'express';
const router = express.Router();
import { getAdmins, addAdmin, editAdmin, deleteAdmin, getAdminById } from '../controllers/adminController.js';

router.get('/', getAdmins); // קבלת כל האדמינים
router.post('/', addAdmin); // הוספת אדמין חדש
router.get('/:id', getAdminById); // קבלת אדמין לפי מזהה
router.put('/edit/:id', editAdmin); // עדכון אדמין
router.delete('/:id', deleteAdmin); // מחיקת אדמין

export default router;

