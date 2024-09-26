import express from 'express';
const router = express.Router();
import { 
    getLoans, 
    addLoan, 
    editLoan, 
    deleteLoan, 
    getLoanById,
    getLoansByUserId // ייבוא הפונקציה לקבלת הלוואות לפי מזהה משתמש
} from '../controllers/loanController.js';

// קבלת כל ההשאלות
router.get('/', getLoans);

// הוספת השאלה
router.post('/', addLoan);

// עדכון השאלה לפי מזהה
router.put('/:id', editLoan);

// מחיקת השאלה לפי מזהה
router.delete('/:id', deleteLoan);

// קבלת השאלה לפי מזהה
router.get('/:id', getLoanById); 

// קבלת השאלות לפי מזהה משתמש
router.get('/user/:user_id', getLoansByUserId); // הוספת מסלול חדש לקבלת הלוואות לפי מזהה משתמש

export default router;
