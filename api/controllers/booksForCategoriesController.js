import { db } from '../db.js';

// קבלת כל הקשרים בין ספרים לקטגוריות
export const getBooksForCategories = (req, res) => {
    db.query('SELECT * FROM books_for_category', (err, results) => {
        if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים', details: err.message });
        res.json(results);
    });
};

// הוספת ספר לקטגוריה
export const addBooksForCategory = (req, res) => {
    const { book_id, category_id } = req.body;
    console.log(req.body); // רישום תוכן הבקשה

    // בדיקת קיום ספר בקטגוריה
    db.query('SELECT * FROM books_for_category WHERE book_id = ? AND category_id = ?', [book_id, category_id], (err, results) => {
        if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים', details: err.message });

        if (results.length > 0) {
            return res.status(400).json({ error: 'הספר כבר נמצא בקטגוריה' });
        } 

        // הוספת ספר לקטגוריה אם לא קיים
        db.query('INSERT INTO books_for_category (book_id, category_id) VALUES (?, ?)', [book_id, category_id], (err) => {
            if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים', details: err.message });
            res.status(201).json({ message: 'ספר לקטגוריה נוסף בהצלחה' });
        });
    });
};

// עדכון קשר בין ספר לקטגוריה
export const editBooksForCategory = (req, res) => {
    const { id } = req.params;
    const { book_id, category_id } = req.body;
    db.query('UPDATE books_for_category SET book_id = ?, category_id = ? WHERE book_id = ? AND category_id = ?', [book_id, category_id, book_id, category_id], (err) => {
        if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים', details: err.message });
        res.json({ message: 'הקשר בין הספר לקטגוריה עודכן בהצלחה' });
    });
};

// מחיקת ספר מקטגוריה
export const deleteBooksForCategory = async (req, res) => {
    const { book_id, category_id } = req.body;

    if (!book_id || !category_id) {
        return res.status(400).json({ details: 'מזהה ספר וקטגוריה נדרשים' });
    }

    try {
        // מחיקת ספר מהקטגוריה
        await db.query('DELETE FROM books_for_category WHERE book_id = ? AND category_id = ?', [book_id, category_id]);
        res.status(200).json({ message: 'הספר הוסר מהקטגוריה בהצלחה' });
    } catch (error) {
        console.error('שגיאה במחיקת הספר מהקטגוריה:', error);
        res.status(500).json({ details: 'שגיאה במחיקת הספר מהקטגוריה' });
    }
};

// קבלת קטגוריות עם ספרים
export const getCategoriesWithBooks = (req, res) => {
    db.query(`
        SELECT c.id AS category_id, c.name AS category_name, b.id AS book_id, b.title
        FROM categories c
        LEFT JOIN books_for_category bfc ON c.id = bfc.category_id
        LEFT JOIN books b ON bfc.book_id = b.id
        ORDER BY c.id, b.id
    `, (err, results) => {
        if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים', details: err.message });
        
        // ארגון התוצאות לקטגוריות עם ספרים
        const categories = results.reduce((acc, row) => {
            let category = acc.find(c => c.id === row.category_id);
            if (!category) {
                category = { id: row.category_id, name: row.category_name, books: [] };
                acc.push(category);
            }
            if (row.book_id) {
                category.books.push({ id: row.book_id, title: row.title });
            }
            return acc;
        }, []);

        res.json(categories);
    });
};
