import { db } from '../db.js';

// קבלת כל הקטגוריות
export const getCategories = (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        res.json(results);
    });
};

// הוספת קטגוריה
export const addCategory = (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO categories (name) VALUES (?)', [name], (err) => {
        if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        res.status(201).json({ message: 'קטגוריה נוספה בהצלחה' });
    });
};

// עדכון קטגוריה
export const editCategory = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id], (err) => {
        if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        res.json({ message: 'קטגוריה עודכנה בהצלחה' });
    });
};

// מחיקת קטגוריה
export const deleteCategory = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM categories WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        res.json({ message: 'קטגוריה נמחקה בהצלחה' });
    });
};
