import React, { useState, useEffect } from 'react';
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
    width: 80%;
    max-width: 400px; /* Limit max width */
    text-align: center;
`;

const Title = styled.h2`
    margin-bottom: 20px;
    color: black; 
`;

const InputList = styled.ul`
    list-style-type: none; /* Remove default list styling */
    padding: 10px;
    width: 90%; 
`;

const InputItem = styled.li`
    margin: 5px 0; /* Space between items */
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #004d40; /* Darker teal */
    border-radius: 5px;
    width: 90%; /* Full width of the list item */
    font-size: 16px;
    color: black; /* Font color set to black */
`;

const TextArea = styled.textarea`
    padding: 10px;
    border: 1px solid #004d40; /* Darker teal */
    border-radius: 5px;
    width: 90%; /* Full width of the list item */
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
        background-color: #00aaff; 
    }
`;

const Message = styled.p`
    color: #d32f2f; /* Red for error messages */
`;

const EditBookBySearch = () => {
    const [bookId, setBookId] = useState('');
    const [bookData, setBookData] = useState({ title: '', author: '', year: '', description: '', available: false, genre: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData({ ...bookData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!bookId) {
            setMessage('🛑 אנא הזן את מזהה הספר.');
            return;
        }

        try {
            setMessage(`📚 הספר עם מזהה ${bookId} עודכן.`);
            setBookData({ title: '', author: '', year: '', description: '', available: false, genre: '' });
            setBookId('');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setMessage('❌ הספר לא נמצא.');
            } else {
                setMessage(`⚠️ שגיאה בעדכון הספר: ${error.message}`);
            }
        }
    };

    const fetchBookData = async (id) => {
        try {
            const response = await axios.get(`/books/search/${id}`);
            setBookData(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setMessage('❌ הספר לא נמצא.');
            } else {
                setMessage(`⚠️ שגיאה בטעינת נתוני הספר: ${error.message}`);
            }
        }
    };

    useEffect(() => {
        if (bookId) {
            fetchBookData(bookId);
        }
    }, [bookId]);

    return (
        <Container>
            <Box>
                <Title>ערוך ספר לפי מזהה ✏️</Title>
                <Input 
                    type="text" 
                    value={bookId} 
                    onChange={(e) => setBookId(e.target.value)} 
                    placeholder="הזן את מזהה הספר" 
                />
                <form onSubmit={handleSubmit}>
                    <InputList>
                        <InputItem>
                            <Input 
                                type="text" 
                                name="title" 
                                value={bookData.title} 
                                onChange={handleChange} 
                                placeholder="כותרת" 
                                required 
                            />
                        </InputItem>
                        <InputItem>
                            <Input 
                                type="text" 
                                name="author" 
                                value={bookData.author} 
                                onChange={handleChange} 
                                placeholder="מחבר" 
                                required 
                            />
                        </InputItem>
                        <InputItem>
                            <Input 
                                type="number" 
                                name="year" 
                                value={bookData.year} 
                                onChange={handleChange} 
                                placeholder="שנה" 
                                required 
                            />
                        </InputItem>
                        <InputItem>
                            <TextArea 
                                name="description" 
                                value={bookData.description} 
                                onChange={handleChange} 
                                placeholder="תיאור" 
                            />
                        </InputItem>
                        <InputItem>
                            <label style={{ color: '#004d40' }}>
                                זמין:
                                <input 
                                    type="checkbox" 
                                    name="available" 
                                    checked={bookData.available} 
                                    onChange={(e) => setBookData({ ...bookData, available: e.target.checked })} 
                                />
                            </label>
                        </InputItem>
                    </InputList>
                    <Button type="submit">
                        עדכן ספר 📚
                    </Button>
                </form>
                {message && <Message>{message}</Message>}
            </Box>
        </Container>
    );
};

export default EditBookBySearch;
