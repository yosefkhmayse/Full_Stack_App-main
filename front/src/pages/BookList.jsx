import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/books');
      setBooks(response.data);
    } catch (err) {
      console.error('נכשל בשליפת הספרים:', err);
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`/books/${id}`);
      fetchBooks(); // רענן את הרשימה לאחר מחיקת הספר
    } catch (err) {
      console.error('נכשל במחיקת הספר:', err);
    }
  };

  return (
    <div style={outerContainerStyle}>
      <div style={containerStyle}>
        <Link to="/add" style={addButtonStyle}>➕ הוסף ספר חדש</Link>
        <div style={bookGridStyle}>
          {books.map((book) => (
            <div key={book.id} style={bookItemStyle}>
              {book.image && (
                <img src={book.image} alt={book.title} style={bookImageStyle} />
              )}
              <div style={bookDetailsStyle}>
                <p><strong>📖 כותרת:</strong> {book.title}</p>
                <p><strong>🖊 מחבר:</strong> {book.author}</p>
                <p><strong>📅 שנה:</strong> {book.year}</p>
                <p><strong>📚 סוגה:</strong> {book.genre}</p>
                <p><strong>🔢 מזהה ספר:</strong> {book.id}</p> {/* Display Book ID */}
                <div style={bookActionsStyle}>
                  <button style={deleteButtonStyle} onClick={() => deleteBook(book.id)}>❌ מחק</button>
                  <Link to={`/edit/${book.id}`} style={editLinkStyle}>✏️ ערוך</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookList;

// Inline Styles
const outerContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f4f4f4'
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  backgroundColor: 'white',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  width: '80%', // Adjust as needed
  maxWidth: '1200px' // Adjust as needed
};

const addButtonStyle = {
  display: 'inline-block',
  padding: '10px 15px',
  marginBottom: '20px',
  backgroundColor: '#00aaff',
  color: 'white',
  borderRadius: '5px',
  textDecoration: 'none',
  textAlign: 'center'
};

const bookGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '20px',
  justifyContent: 'center'
};

const bookItemStyle = {
  border: '1px solid #ddd',
  borderRadius: '5px',
  padding: '10px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  textAlign: 'center'
};

const bookImageStyle = {
  width: '100%',
  height: 'auto',
  borderRadius: '5px'
};

const bookDetailsStyle = {
  marginTop: '10px'
};

const bookActionsStyle = {
  marginTop: '10px'
};

const deleteButtonStyle = {
  padding: '5px 10px',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginRight: '10px'
};

const editLinkStyle = {
  padding: '5px 10px',
  backgroundColor: '#4caf50',
  color: 'white',
  borderRadius: '5px',
  textDecoration: 'none'
};
