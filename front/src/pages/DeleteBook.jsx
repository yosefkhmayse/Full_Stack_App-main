import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5; /* Light green background */
`;

const Box = styled.div`
    background-color: #c4feff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 20px;
    width: 100%;
    max-width: 400px; /* Limit max width */
    text-align: center;
`;

const Title = styled.h2`
    margin-bottom: 20px;
    color: black;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #004d40; /* Darker teal */
    border-radius: 5px;
    width: 90%; /* Full width */
    font-size: 16px;
    color: black; /* Font color set to black */
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
        background-color: #005fd1; /* Darker green on hover */
    }
`;

const Message = styled.p`
    color: #d32f2f; /* Red for error messages */
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
            const response = await axios.delete(`/books/search/${bookId}`);
            if (response.status === 204) {
                setMessage(`📚 הספר עם מזהה ${bookId} נמחק.`);
                setBookId(''); // Clear the input field
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setMessage('❌ הספר לא נמצא.');
            } else {
                setMessage(`⚠️ שגיאה במחיקת הספר: ${error.message}`);
            }
        }
    };

    return (
        <Container>
            <Box>
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
