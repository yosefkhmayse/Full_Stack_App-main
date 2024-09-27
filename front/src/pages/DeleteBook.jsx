import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
`;

const HomeButton = styled.button`
  padding: 10px 15px;
  background-color: #142e99;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    background-color: #0f1e66;
  }
`;

const Box = styled.div`
    background-color: #c4feff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 20px;
    width: 100%;
    max-width: 400px;
    text-align: center;
`;

const Title = styled.h2`
    margin-bottom: 20px;
    color: black;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #004d40;
    border-radius: 5px;
    width: 90%;
    font-size: 16px;
    color: black;
`;

const Button = styled.button`
    padding: 10px 20px;
    cursor: pointer;
    background-color: #00aaff; 
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    margin-top: 10px;

    &:hover {
        background-color: #005fd1;
    }
`;

const Message = styled.p`
    color: #d32f2f;
`;

const DeleteBook = () => {
    const [bookId, setBookId] = useState('');
    const [message, setMessage] = useState('');

    const handleDelete = async () => {
        if (!bookId) {
            setMessage('🛑 אנא הזן את מזהה הספר.');
            return;
        }
    
        try {
            // Check if the book exists in the database
            const checkResponse = await axios.get(`/books/${bookId}`);
            if (checkResponse.status === 200) {
                // Proceed with deletion if the book exists
                const response = await axios.delete(`/books/${bookId}`);
                if (response.status === 204) {
                    setMessage(`📚 הספר עם מזהה ${bookId} נמחק.`);
                    setBookId(''); // Clear the input field
                }
            }
        } catch (error) {
            // If the book doesn't exist, show an appropriate message
            if (error.response && error.response.status === 404) {
                setMessage('❌ הספר לא נמצא.');
            } else if (error.response && error.response.status === 400) {
                // Check if the error is due to category association
                setMessage('⚠️ לא ניתן למחוק ספר ששייך לקטגוריה.');
            } else {
                // Handle other errors (network issues, etc.)
                setMessage(`⚠️ שגיאה במחיקת הספר: ${error.message}`);
            }
        }
    };
    
    return (
        <Container>
            <Box>
                <Link to="/adminhome">
                    <HomeButton>🏠 חזור לדף הבית</HomeButton>
                </Link>
                <Title>מחק ספר לפי מזהה</Title>
                <Input 
                    type="text" 
                    value={bookId} 
                    onChange={(e) => setBookId(e.target.value)} 
                    placeholder="הזן את מזהה הספר" 
                />
                <Button onClick={handleDelete}>
                    מחק ספר 📚
                </Button>
                {message && <Message>{message}</Message>}
            </Box>
        </Container>
    );
};

export default DeleteBook;
