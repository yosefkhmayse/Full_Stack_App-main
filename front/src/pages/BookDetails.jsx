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
  const [feedback, setFeedback] = useState(''); // State for user feedback input
  const [feedbackList, setFeedbackList] = useState([]); // Store all feedbacks
  const [error, setError] = useState('');
  const { user } = useUserContext(); // Get user context

  // Fetch book details
  const fetchBook = useCallback(async () => {
    try {
      const response = await axios.get(`/books/search/${id}`);
      setBook(response.data);
    } catch (err) {
      setError('שגיאה בשליפת פרטי הספר. אנא נסה שוב מאוחר יותר.');
    }
  }, [id]);

  // Fetch book rating and feedback
  const fetchRatingsAndFeedback = useCallback(async () => {
    try {
      const response = await axios.get(`/ratings/${id}`);
      setRating(response.data.averageRating || 0); // Set the average rating
      setFeedbackList(response.data.feedbacks || []); // Set the list of feedbacks
    } catch (err) {
      setError('שגיאה בשליפת הדירוג והמשוב. אנא נסה שוב מאוחר יותר.');
    }
  }, [id]);

  // Fetch book details and ratings/feedback when component mounts or ID changes
  useEffect(() => {
    fetchBook();
    fetchRatingsAndFeedback(); // Fetch both book and feedback
  }, [fetchBook, fetchRatingsAndFeedback]);

  // Handle rating and feedback submission
  const handleRating = async (newRating) => {
    if (!user || !user.id) {
      setError('חובה להתחבר כדי להוסיף דירוג.');
      return;
    }

    try {
      const response = await axios.post('/ratings', {
        bookId: id,
        rating: newRating,
        feedback // Include the feedback
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        fetchRatingsAndFeedback(); // Refresh ratings and feedback after submission
        setFeedback(''); // Clear feedback input
        setError(''); // Clear any errors
      } else {
        setError('שגיאה בהגדרת הדירוג. אנא נסה שוב מאוחר יותר.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'שגיאה בהגדרת הדירוג. אנא נסה שוב מאוחר יותר.';
      setError(errorMessage);
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
        <FeedbackInput
          placeholder="כתוב משוב על הספר"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <SubmitButton onClick={() => handleRating(rating)}>שלח דירוג ומשוב</SubmitButton>
      </BookRating>

      {/* Display all user feedback */}
      <FeedbackList>
        {feedbackList.length > 0 ? (
          feedbackList.map((item, index) => (
            <FeedbackItem key={index}>
              <strong>משתמש:</strong> {item.username} <br />
              <strong>דירוג:</strong> {item.rating} <br />
              <strong>משוב:</strong> {item.feedback}
            </FeedbackItem>
          ))
        ) : (
          <p>אין משובים על הספר הזה עדיין.</p>
        )}
      </FeedbackList>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </BookDetailsContainer>
  );
};

export default BookDetails;

// Styled Components
const BookDetailsContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 40px auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BookImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const BookTitle = styled.h1`
  font-size: 2em;
  margin: 20px 0;
  text-align: center;
`;

const BookInfo = styled.p`
  font-size: 1.2em;
  margin: 10px 0;
  text-align: center;
`;

const BookDescription = styled.p`
  font-size: 1em;
  margin: 20px 0;
  text-align: center;
`;

const Availability = styled.p`
  color: ${props => (props.available ? '#388e3c' : '#d32f2f')};
  font-weight: bold;
`;

const BookRating = styled.div`
  margin: 20px 0;
  text-align: center;
`;

const FeedbackInput = styled.textarea`
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const FeedbackList = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const FeedbackItem = styled.div`
  background-color: #f1f1f1;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
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
  text-align: center;
`;
