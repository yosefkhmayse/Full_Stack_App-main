import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import StarRating from './StarRating';
import { useUserContext } from '../context/UserContext';

const BookDetails = () => {
  const { id } = useParams(); // Get book ID from URL parameters
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const { user } = useUserContext(); // Get user context

  // Fetch book details
  const fetchBook = useCallback(async () => {
    console.log('Fetching book details for ID:', id);
    try {
      const response = await axios.get(`/books/search/${id}`);
      console.log('Book details retrieved:', response.data);
      setBook(response.data);
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError('שגיאה בשליפת פרטי הספר. אנא נסה שוב מאוחר יותר.');
    }
  }, [id]);

  // Fetch book rating
  const fetchRating = useCallback(async () => {
    console.log('Fetching rating for book ID:', id);
    try {
      const response = await axios.get(`/ratings/${id}`);
      console.log('Book rating retrieved:', response.data);
      setRating(response.data.averageRating || 0);
    } catch (err) {
      console.error('Error fetching rating:', err);
      setError('שגיאה בשליפת הדירוג. אנא נסה שוב מאוחר יותר.');
    }
  }, [id]);

  // Fetch book details and rating when component mounts or ID changes
  useEffect(() => {
    fetchBook();
    fetchRating();
  }, [fetchBook, fetchRating]);

  const handleRating = async (newRating) => {
    console.log('User context:', user?.id); // Check if user is available and has an ID
    console.log('Book ID:', id);
    console.log('New Rating:', newRating);

    if (!user || !user.id) {
      console.error('Error: User is not authenticated or missing ID.');
      setError('חובה להתחבר כדי להוסיף דירוג.');
      return;
    }

    if (!id) {
      console.error('Error: Missing book ID.');
      setError('חובה לספק מזהה ספר.');
      return;
    }

    if (newRating === undefined || newRating === null || isNaN(newRating)) {
      console.error('Error: Invalid rating value.');
      setError('חובה לספק דירוג תקין.');
      return;
    }

    console.log('Sending rating update:', { bookId: id, userId: user.id, rating: newRating });

    try {
      const response = await axios.post('/ratings', {
        bookId: id,
        rating: newRating,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        console.log('Rating set successfully.');
        fetchRating(); // Refresh rating after update
        setError(''); // Clear error message on success
      } else {
        console.error('Unexpected response status:', response.status);
        setError('שגיאה בהגדרת הדירוג. אנא נסה שוב מאוחר יותר.');
      }
    } catch (error) {
      console.error('Error setting rating:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'שגיאה בהגדרת הדירוג. אנא נסה שוב מאוחר יותר.';
      setError(errorMessage); // Show detailed error message
    }
  };

  if (!book) return <LoadingMessage>טוען פרטי ספר...</LoadingMessage>;

  return (
    <BookDetailsContainer>
      <BookImage src={book.image} alt={book.title} />
      <BookTitle>{book.title}</BookTitle>
      <BookInfo><strong>מחבר:</strong> {book.author}</BookInfo>
      <BookInfo><strong>שנה:</strong> {book.year}</BookInfo>
      <BookDescription><strong>תיאור:</strong> {book.description}</BookDescription>
      <Availability available={book.available}>
                         {book.available ? '✅ זמין' : '❌ לא זמין'}
                     </Availability>
      <BookRating>
        <strong>דירוג נוכחי:</strong>
        <StarRating rating={rating} onRatingChange={handleRating} />
      </BookRating>
      {error && <ErrorMessage>{error}</ErrorMessage>} {/* Show error message */}
    </BookDetailsContainer>
  );
};

export default BookDetails;

// Styled Components
const BookDetailsContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 40px auto; /* Center and add space at the top */
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
`;
const Availability = styled.p`
    color: ${props => (props.available ? '#388e3c' : '#d32f2f')};
    font-weight: bold;
`;

const BookImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px; /* Space below image */
`;

const BookTitle = styled.h1`
  font-size: 2em;
  margin: 20px 0;
  text-align: center; /* Center title */
`;

const BookInfo = styled.p`
  font-size: 1.2em;
  margin: 10px 0;
  text-align: center; /* Center text */
`;

const BookDescription = styled.p`
  font-size: 1em;
  margin: 20px 0;
  text-align: center; /* Center text */
`;

const BookRating = styled.div`
  margin: 20px 0;
  text-align: center; /* Center rating */
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.5em;
  margin: 20px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 1.2em;
  margin: 20px;
  text-align: center; /* Center error message */
`;
