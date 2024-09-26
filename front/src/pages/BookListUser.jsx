import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import StarRating from './StarRating';

const BookListUser = () => {
  const [books, setBooks] = useState([]);
  const [ratings, setRatings] = useState({}); // State to store ratings for each book

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/books');
        const booksData = response.data;
        setBooks(booksData);
        fetchRatings(booksData);
      } catch (err) {
        console.error('נכשל בשליפת הספרים:', err);
      }
    };

    const fetchRatings = async (booksData) => {
      try {
        const ratingsData = {};
        for (const book of booksData) {
          const response = await axios.get(`/ratings/${book.id}`);
          ratingsData[book.id] = response.data.averageRating || 0;
        }
        setRatings(ratingsData);
      } catch (err) {
        console.error('נכשל בשליפת הדירוג:', err);
      }
    };

    fetchBooks();
  }, []); // Empty dependency array

  return (
    <PageContainer>
      <Header>📚 רשימת ספרים</Header>
      <BookGrid>
        {books.map((book) => (
          <BookItem key={book.id}>
            {book.image && (
              <BookImage src={book.image} alt={book.title} />
            )}
            <BookDetails>
              <p><strong>כותרת:</strong> {book.title}</p>
              <p><strong>מחבר:</strong> {book.author}</p>
              <p><strong>שנה:</strong> {book.year}</p>
              <p><strong>סוגה:</strong> {book.genre}</p>
              <StarRating rating={ratings[book.id] || 0} onRatingChange={() => {}} />
            </BookDetails>
            <BookActions>
              <Link to={`/bookdetails/${book.id}`}>📖 פרטים</Link>
            </BookActions>
          </BookItem>
        ))}
      </BookGrid>
    </PageContainer>
  );
};

export default BookListUser;

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Use min-height for centering */
  background-color: #f0f0f0;
`;

const Header = styled.h1`
  font-size: 2em;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 columns */
  gap: 20px;
  width: 100%;
  max-width: 1200px; /* Increase max-width for better spacing */
  justify-items: center; /* Center items within the grid */
`;

const BookItem = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  display: flex;
  flex-direction: column; /* Ensure items stack vertically */
  align-items: center; /* Center content horizontally */
  text-align: center; /* Center text within item */
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const BookImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const BookDetails = styled.div`
  margin: 10px 0;
`;

const BookActions = styled.div`
  a {
    text-decoration: none;
    color: #007bff;
    font-size: 1.1em;

    &:hover {
      text-decoration: underline;
    }
  }
`;
