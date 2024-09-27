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
export const deleteBooksForCategory = (req, res) => {
    const { book_id, category_id } = req.body;

    if (!book_id || !category_id) {
        return res.status(400).json({ details: 'מזהה ספר וקטגוריה נדרשים' });
    }

    db.query('DELETE FROM books_for_category WHERE book_id = ? AND category_id = ?', [book_id, category_id], (err, results) => {
        if (err) {
            console.error('שגיאה במחיקת הספר מהקטגוריה:', err);
            return res.status(500).json({ details: 'שגיאה במחיקת הספר מהקטגוריה' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ details: 'הספר לא נמצא בקטגוריה' });
        }
        res.status(200).json({ message: 'הספר הוסר מהקטגוריה בהצלחה' });
    });
};
export const getCategoriesWithBooks = (req, res) => {
    const categoryId = req.params.id;
    console.log(`Fetching books for category ID: ${categoryId}`);

    db.query(`
        SELECT c.id AS category_id, c.name AS category_name, b.id AS book_id, b.title, b.author, b.year, b.description, b.available, b.image, b.genre
        FROM categories c
        LEFT JOIN books_for_category bfc ON c.id = bfc.category_id
        LEFT JOIN books b ON bfc.book_id = b.id
        WHERE c.id = ?
    `, [categoryId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'שגיאה בבסיס הנתונים', details: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'לא נמצאו קטגוריות או ספרים' });
        }

        // Use environment variable or fallback to localhost
        const imageBaseUrl = process.env.IMAGE_BASE_URL || 'http://localhost:8800/public/upload';

        const categoryWithBooks = {
            id: results[0].category_id,
            name: results[0].category_name,
            books: results.map(row => ({
                id: row.book_id,
                title: row.title,
                author: row.author,
                year: row.year,
                description: row.description,
                available: row.available,
                image: row.image ? `${imageBaseUrl}/${row.image}` : null, // Construct image URL
                genre: row.genre
            })).filter(book => book.id) // Only include books with valid IDs
        };

        res.json(categoryWithBooks);
    });
};
