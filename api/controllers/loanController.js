import { db } from '../db.js';

// קבלת כל ההשאלות
export const getLoans = (req, res) => {
    db.query('SELECT * FROM loans', (err, results) => {
        if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        res.json(results);
    });
};

// קבלת השאלות לפי מזהה משתמש
export const getLoansByUserId = (req, res) => {
    const { user_id } = req.params;
    db.query('SELECT * FROM loans WHERE user_id = ?', [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        if (results.length === 0) return res.status(404).json({ error: 'לא נמצאו השאלות עבור משתמש זה' });
        res.json(results);
    });
};

// הוספת השאלה
export const addLoan = (req, res) => {
    const { book_id, user_id, loaned_date, returned_date, returned } = req.body;
    db.query('INSERT INTO loans (book_id, user_id, loaned_date, returned_date, returned) VALUES (?, ?, ?, ?, ?)', 
    [book_id, user_id, loaned_date, returned_date, returned], 
    (err) => {
        if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        res.status(201).json({ message: 'ההשאלה נוספה בהצלחה' });
    });
};

// עדכון השאלה
export const editLoan = (req, res) => {
    const { id } = req.params;
    const { book_id, user_id, loaned_date, returned_date, returned } = req.body;
    db.query('UPDATE loans SET book_id = ?, user_id = ?, loaned_date = ?, returned_date = ?, returned = ? WHERE id = ?', 
    [book_id, user_id, loaned_date, returned_date, returned, id], 
    (err) => {
        if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        res.json({ message: 'ההשאלה עודכנה בהצלחה' });
    });
};

// מחיקת השאלה
export const deleteLoan = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM loans WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        res.json({ message: 'ההשאלה נמחקה בהצלחה' });
    });
};

// קבלת השאלה לפי מזהה
export const getLoanById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM loans WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        if (results.length === 0) return res.status(404).json({ error: 'ההשאלה לא נמצאה' });
        res.json(results[0]);
    });
};
