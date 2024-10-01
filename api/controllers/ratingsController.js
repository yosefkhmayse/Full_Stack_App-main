import { db } from '../db.js';
import { authenticateToken } from '../middleware/authenticate.js';

export const setRating = [
  authenticateToken,
  async (req, res) => {
    const { bookId, rating, feedback } = req.body;
    const userId = req.user.id;

    if (!bookId || rating === undefined) {
      return res.status(400).json({ error: 'חובה לספק מזהה ספר ודירוג' });
    }

    const userIdInt = parseInt(req.user.id, 10);
    const bookIdInt = parseInt(bookId, 10);

    if (isNaN(userIdInt) || isNaN(bookIdInt)) {
      return res.status(400).json({ error: 'מזהה משתמש או מזהה ספר לא חוקי' });
    }

    // Check if rating exists, if so, update, else insert new rating and feedback
    db.query('SELECT * FROM ratings WHERE book_id = ? AND user_id = ?', [bookIdInt, userIdInt], (err, results) => {
      if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });

      if (results.length > 0) {
        // Update rating and feedback
        db.query('UPDATE ratings SET rating = ?, feedback = ? WHERE book_id = ? AND user_id = ?', [rating, feedback, bookIdInt, userIdInt], (err) => {
          if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
          res.status(200).json({ message: 'הדירוג והמשוב עודכנו בהצלחה' });
        });
      } else {
        // Insert new rating and feedback
        db.query('INSERT INTO ratings (book_id, user_id, rating, feedback) VALUES (?, ?, ?, ?)', [bookIdInt, userIdInt, rating, feedback], (err) => {
          if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
          res.status(200).json({ message: 'הדירוג והמשוב נשמרו בהצלחה' });
        });
      }
    });
  }
];

export const getRating = async (req, res) => {
  const { id: bookId } = req.params;

  db.query('SELECT AVG(rating) AS averageRating FROM ratings WHERE book_id = ?', [bookId], (err, avgResults) => {
    if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });

    const averageRating = avgResults[0].averageRating;

    // Fetch all feedbacks with ratings
    db.query('SELECT ratings.rating, ratings.feedback, users.username FROM ratings JOIN users ON ratings.user_id = users.id WHERE ratings.book_id = ?', [bookId], (err, feedbackResults) => {
      if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });

      res.status(200).json({ averageRating, feedbacks: feedbackResults });
    });
  });
};
