import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import StarRating from './StarRating';
import { useUserContext } from '../context/UserContext';

const BookDetails = () => {
  const { id } = useParams(); // קבלת מזהה הספר מפרמטרי ה-URL
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const { user } = useUserContext(); // קבלת הקשר של המשתמש

  // שליפת פרטי הספר
  const fetchBook = useCallback(async () => {
    console.log('שליפת פרטי הספר עבור מזהה:', id);
    try {
      const response = await axios.get(`/books/${id}`);
      console.log('פרטי הספר נשלפו:', response.data);
      setBook(response.data);
    } catch (err) {
      console.error('שגיאה בשליפת פרטי הספר:', err);
      setError('שגיאה בשליפת פרטי הספר. אנא נסה שוב מאוחר יותר.');
    }
  }, [id]);

  // שליפת דירוג הספר
  const fetchRating = useCallback(async () => {
    console.log('שליפת דירוג עבור מזהה הספר:', id);
    try {
      const response = await axios.get(`/ratings/${id}`);
      console.log('דירוג הספר נשלף:', response.data);
      setRating(response.data.averageRating || 0);
    } catch (err) {
      console.error('שגיאה בשליפת הדירוג:', err);
      setError('שגיאה בשליפת הדירוג. אנא נסה שוב מאוחר יותר.');
    }
  }, [id]);

  // שליפת פרטי הספר ודירוג כשמרכיב נטען או כשמזהה משתנה
  useEffect(() => {
    fetchBook();
    fetchRating();
  }, [fetchBook, fetchRating]);

  const handleRating = async (newRating) => {
    console.log('קשר המשתמש:', user?.id); // בדוק אם המשתמש זמין ויש לו מזהה
    console.log('מזהה הספר:', id);
    console.log('דירוג חדש:', newRating);

    if (!user || !user.id) {
      console.error('שגיאה: המשתמש אינו מזוהה או חסר מזהה.');
      setError('חובה להתחבר כדי להוסיף דירוג.');
      return;
    }

    if (!id) {
      console.error('שגיאה: מזהה הספר חסר.');
      setError('חובה לספק מזהה ספר.');
      return;
    }

    if (newRating === undefined || newRating === null || isNaN(newRating)) {
      console.error('שגיאה: ערך דירוג לא חוקי.');
      setError('חובה לספק דירוג תקין.');
      return;
    }

    console.log('שליחת עדכון דירוג:', { bookId: id, userId: user.id, rating: newRating });

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
        console.log('הדירוג הוגדר בהצלחה.');
        fetchRating(); // רענן דירוג לאחר העדכון
        setError(''); // נקה הודעת שגיאה בהצלחה
      } else {
        console.error('סטטוס תגובה בלתי צפוי:', response.status);
        setError('שגיאה בהגדרת הדירוג. אנא נסה שוב מאוחר יותר.');
      }
    } catch (error) {
      console.error('שגיאה בהגדרת הדירוג:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'שגיאה בהגדרת הדירוג. אנא נסה שוב מאוחר יותר.';
      setError(errorMessage); // הצג הודעת שגיאה מפורטת
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
      <BookRating>
        <strong>דירוג נוכחי:</strong>
        <StarRating rating={rating} onRatingChange={handleRating} />
      </BookRating>
      {error && <ErrorMessage>{error}</ErrorMessage>} {/* הצג הודעת שגיאה */}
    </BookDetailsContainer>
  );
};

export default BookDetails;

// Styled Components
const BookDetailsContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 40px auto; /* מרכז והוסף רווח למעלה */
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center; /* מרכז תוכן אופקית */
`;

const BookImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px; /* רווח מתחת לתמונה */
`;

const BookTitle = styled.h1`
  font-size: 2em;
  margin: 20px 0;
  text-align: center; /* מרכז כותרת */
`;

const BookInfo = styled.p`
  font-size: 1.2em;
  margin: 10px 0;
  text-align: center; /* מרכז טקסט */
`;

const BookDescription = styled.p`
  font-size: 1em;
  margin: 20px 0;
  text-align: center; /* מרכז טקסט */
`;

const BookRating = styled.div`
  margin: 20px 0;
  text-align: center; /* מרכז דירוג */
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
  text-align: center; /* מרכז הודעת שגיאה */
`;
