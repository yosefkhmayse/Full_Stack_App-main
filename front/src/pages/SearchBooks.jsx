import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start; /* Align items to the top */
    height: 100vh;
    background: linear-gradient(135deg, #f5f5f5, #e0f7fa);
    font-family: 'Arial', sans-serif;
    padding-top: 50px; /* Margin from the top of the page */
`;

const Box = styled.div`
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    padding: 30px;
    width: 100%;
    max-width: 900px;
    text-align: center;
`;

const Title = styled.h2`
    margin-bottom: 20px;
    color: #388e3c;
    font-size: 2em;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
    padding: 12px;
    border: 2px solid #004d40;
    border-radius: 5px;
    width: 50%;
    font-size: 16px;
    margin-bottom: 10px;
    transition: border-color 0.3s;

    &:focus {
        border-color: #388e3c;
        outline: none;
    }
`;

const Button = styled.button`
    padding: 12px 25px;
    cursor: pointer;
    background-color: #388e3c;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    margin-top: 10px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #2e7d32;
    }
`;

const Message = styled.p`
    color: #d32f2f;
    font-weight: bold;
`;

const ResultsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
`;

const BookCard = styled.div`
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-3px);
    }
`;

const BookImage = styled.img`
    width: 100%;
    height: auto;
    border-radius: 5px;
    margin-bottom: 10px;
`;

const Availability = styled.p`
    color: ${props => (props.available ? '#388e3c' : '#d32f2f')};
    font-weight: bold;
`;

const StyledLink = styled(Link)`
    text-decoration: none; // Remove underline
    outline: none; // Remove focus outline
    color: inherit; // Inherit color for text
`;

const SearchBooks = () => {
    const [title, setTitle] = useState('');
    const [results, setResults] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!title) {
            setMessage('⚠️ בבקשה הזן שם ספר.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await axios.get(`/books/search?title=${encodeURIComponent(title)}`);
            if (response.data && response.data.length > 0) {
                setResults(response.data);
            } else {
                setMessage('❌ לא נמצאו ספרים תואמים.');
            }
        } catch (error) {
            setMessage(`⚠️ שגיאה בחיפוש: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Box>
                <Title>חפש ספר לפי שם 📚</Title>
                <Input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="הזן שם ספר" 
                />
                <br />
                <Button onClick={handleSearch} disabled={loading}>
                    {loading ? '🔍 מחפש...' : 'חפש 📖'}
                </Button>
                {message && <Message>{message}</Message>}
                {results.length > 0 && !loading && (
                    <ResultsGrid>
                        {results.map(book => (
                            <BookCard key={book.id}>
                                <StyledLink to={`/bookdetails/${book.id}`}>
                                    {book.image ? (
                                        <BookImage src={book.image} alt={book.title} />
                                    ) : (
                                        <p>🔍 תמונה לא זמינה</p>
                                    )}
                                    <h3>{book.title} 📖</h3>
                                    <p>{book.author} ✍️</p>
                                    <p>{book.year} 📅</p>
                                    <p>{book.genre} 📚</p>
                                    <p>{book.description}</p>
                                    <Availability available={book.available}>
                                        {book.available ? '✅ זמין' : '❌ לא זמין'}
                                    </Availability>
                                </StyledLink>

                            </BookCard>
                        ))}
                    </ResultsGrid>
                )}
            </Box>
        </Container>
    );
};

export default SearchBooks;
