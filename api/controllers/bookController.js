import { db } from '../db.js';

// Helper function to set image path
const setImagePath = (book) => {
  if (book.image) {
    book.image = `http://localhost:8800/public/upload/${book.image}`;
  }
};


// Get all books or search by title
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
      console.error('Query error:', err.message);
      return res.status(500).json({ error: 'Server error: ' + err.message });
    }
    results.forEach(setImagePath);
    res.status(200).json(results);
  });
};

export const getBook = (req, res) => {
  const { title } = req.query;
  let query = 'SELECT * FROM books';
  let queryParams = [];

  if (title) {
    query += ' WHERE title LIKE ?';
    queryParams.push(`%${title}%`);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Query error:', err.message);
      return res.status(500).json({ error: 'Server error: ' + err.message });
    }
    results.forEach(setImagePath);
    res.status(200).json(results);
  });
};

export const getBookforeditdelete   = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM books WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Query error:', err.message);
      return res.status(500).json({ error: 'Server error: ' + err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    const book = results[0];
    setImagePath(book);
    res.status(200).json(book);
  });
};



// Add a new book
export const addBook = (req, res) => {
  const { title, author, year, description, available, genre } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !author || !year || !genre) {
    return res.status(400).json({ error: 'Title, author, year, and genre are required fields.' });
  }

  const isAvailable = available === 'true'; // Convert to boolean

  db.query(
    'INSERT INTO books (title, author, year, image, description, available, genre) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, author, year, image, description, isAvailable ? 1 : 0, genre],
    (err, results) => {
      if (err) {
        console.error('Query error:', err.message);
        return res.status(500).json({ error: 'Server error: ' + err.message });
      }
      res.status(201).json({
        id: results.insertId,
        title,
        author,
        year,
        image,
        description,
        available: isAvailable,
        genre
      });
    }
  );
};

// Delete a book by ID
export const deleteBook = (req, res) => {
  const { id } = req.params;

  // Check if the book exists
  db.query('SELECT * FROM books WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'Server error: ' + err.message });
    }

    // If no book is found, send a 404 error
    if (results.length === 0) {
      return res.status(404).json({ error: '❌ הספר לא נמצא.' });
    }

    // Proceed to delete the book
    db.query('DELETE FROM books WHERE id = ?', [id], (err) => {
      if (err) {
        console.error('Error executing delete query:', err.message);
        return res.status(500).json({ error: 'Server error: ' + err.message });
      }
      res.status(204).send();
    });
  });
};

export const updateBook = (req, res) => {
  const { id } = req.params;
  const { title, author, year, description, available, genre } = req.body;

  // Convert available to a boolean if it’s a string
  const isAvailable = (available === 'true' || available === true) ? 1 : 0; 

  const image = req.file ? req.file.filename : null;

  console.log('Incoming request data:', { title, author, year, description, available, genre, image });

  // Construct the base query
  let query = 'UPDATE books SET title = ?, author = ?, year = ?, description = ?, available = ?, genre = ?';
  let queryParams = [title, author, year, description, isAvailable, genre];

  // Include image in query if it exists
  if (image) {
      query += ', image = ?';
      queryParams.push(image);
  }

  // Specify the book to update
  query += ' WHERE id = ?';
  queryParams.push(id);

  console.log('Executing query:', query, 'with params:', queryParams);

  // Execute the query
  db.query(query, queryParams, (err) => {
      if (err) {
          console.error('Error executing query:', err.message);
          return res.status(500).json({ error: 'Server error: ' + err.message });
      }

      // Respond with the updated book data
      res.status(200).json({
          id,
          title,
          author,
          year,
          image,
          description,
          available: !!isAvailable, // Ensure it's boolean in the response
          genre
      });
  });
};

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

  console.log('Executing SQL:', sql);  // Log the SQL query
  console.log('With parameters:', params); // Log the parameters

  db.query(sql, params, (err, results) => {
      if (err) {
          console.error('Error executing query:', err.message); // Log the error message
          return res.status(500).json({ error: 'Error searching books: ' + err.message });
      }

      results.forEach(setImagePath);
      res.status(200).json(results);
  });
};
