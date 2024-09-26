import React from 'react';
import styled from 'styled-components';

const StarRating = ({ rating, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5]; // מספר הכוכבים

  const handleClick = (star) => {
    if (onRatingChange) onRatingChange(star); // עדכון הדירוג כאשר כוכב נלחץ
  };

  const getStarFill = (star) => {
    if (rating >= star) {
      return 'full'; // כוכב מלא
    } else if (rating >= star - 0.5) {
      return 'half'; // כוכב חצי
    } else {
      return 'empty'; // כוכב ריק
    }
  };

  return (
    <RatingContainer>
      {stars.map((star) => (
        <Star
          key={star}
          onClick={() => handleClick(star)} // טיפול בלחיצה על הכוכב
          fill={getStarFill(star)} // קבלת מצב הכוכב
        >
          &#9733; {/* אייקון כוכב */}
        </Star>
      ))}
    </RatingContainer>
  );
};

export default StarRating;

// רכיבי עיצוב
const RatingContainer = styled.div`
  display: flex; /* הצגת הכוכבים בשורה */
`;

const Star = styled.span`
  font-size: 2em; /* גודל כוכב גדול יותר */
  color: ${(props) => {
    switch (props.fill) {
      case 'full':
        return 'gold'; // צבע כוכב מלא
      case 'half':
        return 'gold'; // צבע כוכב חצי
      case 'empty':
        return '#ddd'; // צבע כוכב ריק
      default:
        return '#ddd';
    }
  }};
  background: ${(props) => 
    props.fill === 'half' ? 'linear-gradient(to right, gold 50%, #ddd 50%)' : 'none'};
  background-clip: text; /* חיתוך רקע */
  -webkit-background-clip: text; /* חיתוך רקע עבור דפדפנים תומכים */
  color: ${(props) => props.fill === 'half' ? 'transparent' : 'none'}; /* שקיפות עבור כוכב חצי */
  cursor: pointer; /* מחוון עכבר */
  transition: color 0.2s; /* אנימציה צבע */

  &:hover {
    color: gold; /* שינוי צבע כאשר העכבר מעל */
  }
`;
