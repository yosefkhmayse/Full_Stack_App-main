import { db } from '../db.js';
import { authenticateToken } from '../middleware/authenticate.js';

export const setRating = [
    authenticateToken,
    async (req, res) => {
        const { bookId, rating } = req.body;
        const userId = req.user.id; // נשאב מהטוקן

        if (!bookId || rating === undefined) {
            return res.status(400).json({ error: 'חובה לספק מזהה ספר ודירוג' });
        }

        const userIdInt = parseInt(req.user.id, 10);

        if (isNaN(userIdInt)) {
            return res.status(400).json({ error: 'מזהה משתמש לא חוקי' });
        }

        const bookIdInt = parseInt(bookId, 10);

        if (isNaN(bookIdInt)) {
            return res.status(400).json({ error: 'מזהה ספר לא חוקי' });
        }

        db.query('SELECT id FROM users WHERE id = ?', [userIdInt], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'משתמש לא נמצא' });
            }

            db.query('SELECT * FROM ratings WHERE book_id = ? AND user_id = ?', [bookIdInt, userIdInt], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
                }

                if (results.length > 0) {
                    db.query('UPDATE ratings SET rating = ? WHERE book_id = ? AND user_id = ?', [rating, bookIdInt, userIdInt], (err) => {
                        if (err) {
                            return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
                        }
                        res.status(200).json({ message: 'הדירוג עודכן בהצלחה' });
                    });
                } else {
                    db.query('INSERT INTO ratings (book_id, user_id, rating) VALUES (?, ?, ?)', [bookIdInt, userIdInt, rating], (err) => {
                        if (err) {
                            return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
                        }
                        res.status(200).json({ message: 'הדירוג הוזן בהצלחה' });
                    });
                }
            });
        });
    }
];

export const getRating = async (req, res) => {
    const bookId = parseInt(req.params.id, 10);

    if (isNaN(bookId)) {
        return res.status(400).json({ error: 'מזהה ספר לא חוקי' });
    }

    db.query('SELECT AVG(rating) AS averageRating FROM ratings WHERE book_id = ?', [bookId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        }

        res.status(200).json(results[0]);
    });
};
