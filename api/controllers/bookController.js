import { db } from '../db.js';

// פונקציית עזר להגדיר נתיב לתמונה
const setImagePath = (book) => {
  if (book.image) {
    book.image = `http://localhost:8800/public/upload/${book.image}`;
  }
};

// קבלת כל הספרים או חיפוש לפי כותרת
export const getBooks = (req, res) => {
  const { title } = req.query;
  let query = 'SELECT * FROM books';
  let queryParams = [];

  if (title) {
    query += ' WHERE title LIKE ?';
    queryParams.push(`%${title}%`);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('שגיאה בביצוע השאילתה:', err.message);
      return res.status(500).json({ error: 'שגיאת שרת: ' + err.message });
    }
    results.forEach(setImagePath);
    res.status(200).json(results);
  });
};

// קבלת ספר יחיד לפי מזהה
export const getBook = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM books WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('שגיאה בביצוע השאילתה:', err.message);
      return res.status(500).json({ error: 'שגיאת שרת: ' + err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'הספר לא נמצא' });
    }
    const book = results[0];
    setImagePath(book);
    res.status(200).json(book);
  });
};

// הוספת ספר חדש
export const addBook = (req, res) => {
  const { title, author, year, description, available, genre } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !author || !year || !genre) {
    return res.status(400).json({ error: 'כותרת, מחבר, שנה וז\'אנר הם שדות חובה.' });
  }

  db.query(
    'INSERT INTO books (title, author, year, image, description, available, genre) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, author, year, image, description, available ? 1 : 0, genre],
    (err, results) => {
      if (err) {
        console.error('שגיאה בביצוע השאילתה:', err.message);
        return res.status(500).json({ error: 'שגיאת שרת: ' + err.message });
      }
      res.status(201).json({
        id: results.insertId,
        title,
        author,
        year,
        image,
        description,
        available,
        genre
      });
    }
  );
};

// מחיקת ספר לפי מזהה
export const deleteBook = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM books WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('שגיאה בביצוע השאילתה:', err.message);
      return res.status(500).json({ error: 'שגיאת שרת: ' + err.message });
    }
    res.status(204).send();
  });
};

// עדכון ספר לפי מזהה
export const updateBook = (req, res) => {
  const { id } = req.params;
  const { title, author, year, description, available, genre } = req.body;
  const image = req.file ? req.file.filename : null;

  let query = 'UPDATE books SET title = ?, author = ?, year = ?, description = ?, available = ?, genre = ?';
  let queryParams = [title, author, year, description, available ? 1 : 0, genre];

  if (image) {
    query += ', image = ?';
    queryParams.push(image);
  }

  query += ' WHERE id = ?';
  queryParams.push(id);

  db.query(query, queryParams, (err) => {
    if (err) {
      console.error('שגיאה בביצוע השאילתה:', err.message);
      return res.status(500).json({ error: 'שגיאת שרת: ' + err.message });
    }
    res.status(200).json({
      id,
      title,
      author,
      year,
      image,
      description,
      available,
      genre
    });
  });
};

// חיפוש ספרים
export const searchBooks = (req, res) => {
  const { query, category } = req.query;
  let sql = 'SELECT books.*, categories.name as category_name FROM books LEFT JOIN categories ON books.category_id = categories.id WHERE 1=1';
  const params = [];

  if (query) {
      sql += ' AND books.title LIKE ?';
      params.push(`%${query}%`);
  }

  if (category) {
      sql += ' AND books.category_id = ?';
      params.push(category);
  }

  console.log('ביצוע SQL:', sql);  // רישום השאילתה
  console.log('עם פרמטרים:', params); // רישום הפרמטרים

  db.query(sql, params, (err, results) => {
      if (err) {
          console.error('שגיאה בביצוע השאילתה:', err.message); // רישום הודעת השגיאה
          return res.status(500).json({ error: 'שגיאה בחיפוש ספרים: ' + err.message });
      }

      results.forEach(setImagePath);
      res.status(200).json(results);
  });
};
