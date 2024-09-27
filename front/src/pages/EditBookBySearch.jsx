import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
    transition: border-color 0.3s;

    &:hover {
        border-color: #00695c; /* Change border color on hover */
    }
`;

const TextArea = styled.textarea`
    padding: 10px;
    border: 1px solid #004d40; /* Darker teal */
    border-radius: 5px;
    width: 90%; /* Full width of the list item */
    font-size: 16px;
    color: black; /* Font color set to black */
    transition: border-color 0.3s;

    &:hover {
        border-color: #00695c; /* Change border color on hover */
    }
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
        background-color: #0f1e66; /* Darker shade on hover */
    }
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
        background-color: #0088cc; /* Darker shade on hover */
    }
`;

const Message = styled.p`
    color: #d32f2f; /* Red for error messages */
`;

const ImagePreview = styled.img`
    max-width: 100%; /* Make sure the image fits within the container */
    height: auto; /* Maintain aspect ratio */
    border-radius: 5px; /* Optional: add border-radius for aesthetics */
    margin-bottom: 10px; /* Space below the image */
`;

const EditBookBySearch = () => {
    const [bookId, setBookId] = useState('');
    const [bookData, setBookData] = useState({ title: '', author: '', year: '', description: '', available: false, genre: '', image: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            // Update available state properly
            setBookData({ ...bookData, [name]: checked });
        } else {
            // Handle other input types
            setBookData({ ...bookData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBookData({ ...bookData, image: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!bookId) {
            setMessage('🛑 אנא הזן את מזהה הספר.');
            return;
        }
    
        try {
            setLoading(true); // Set loading to true
            const formData = new FormData();
            Object.keys(bookData).forEach(key => {
                // Ensure all values are correctly appended to FormData
                if (key === 'available') {
                    formData.append(key, bookData[key] ? 'true' : 'false'); // Send as string for the backend
                } else {
                    formData.append(key, bookData[key]);
                }
            });

            const response = await axios.put(`/books/${bookId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 200) {
                setMessage(`📚 הספר עם מזהה ${bookId} עודכן בהצלחה.`);
                // Clear the form after successful update
                setBookData({ title: '', author: '', year: '', description: '', available: false, genre: '', image: '' });
                setBookId(''); // Clear book ID
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setMessage('❌ הספר לא נמצא.');
            } else {
                setMessage(`⚠️ שגיאה בעדכון הספר: ${error.message}`);
            }
        } finally {
            setLoading(false); // Set loading to false
        }
    };
    
    const fetchBookData = async (id) => {
        setLoading(true); // Set loading to true
        try {
            const response = await axios.get(`/books/search/${id}`);
            setBookData(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setMessage('❌ הספר לא נמצא.');
            } else {
                setMessage(`⚠️ שגיאה בטעינת נתוני הספר: ${error.message}`);
            }
        } finally {
            setLoading(false); // Set loading to false
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
                <Link to="/adminhome">
                    <HomeButton>🏠 חזור לדף הבית</HomeButton>
                </Link> <br />
                <Title>ערוך ספר לפי מזהה ✏️</Title>
                <Input 
                    type="text" 
                    value={bookId} 
                    onChange={(e) => setBookId(e.target.value)} 
                    placeholder="הזן את מזהה הספר" 
                />
                <form onSubmit={handleSubmit}>
                    <InputList>
                        {bookData.image && (
                            <InputItem>
                                <ImagePreview src={bookData.image} alt="Current Book" />
                            </InputItem>
                        )}
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
                                    onChange={handleChange} 
                                />
                            </label>
                        </InputItem>
                        <InputItem>
                            <Input 
                                type="file" 
                                name="image" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                            />
                        </InputItem>
                    </InputList>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'טוען...' : 'עדכן ספר 📚'}
                    </Button>
                </form>
                {message && <Message>{message}</Message>}
            </Box>
        </Container>
    );
};

export default EditBookBySearch;
