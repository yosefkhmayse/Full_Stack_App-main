import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const SearchBooks = () => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Load all categories
        axios.get('/categories')
            .then(response => setCategories(response.data))
            .catch(error => setError('Error loading categories. Please try again later.'));
    }, []);

    const handleSearch = () => {
        const params = {};
        
        // Add the query param if the user entered a book title
        if (query) params.query = query;
        
        // Add the category param if the user selected a category
        if (category) params.category = category;

        axios.get('/books/search', { params })
            .then(response => {
                setBooks(response.data);
                setError(''); // Clear previous errors
            })
            .catch(error => {
                console.error('Error searching books:', error.response ? error.response.data : error.message);
                setError('Error searching books. Please try again later.');
            });
    };

    return (
        <Container>
            <Header>🔍 Search Books</Header>
            <InputsContainer>
                <Input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="🔎 Search by title" 
                />
                <Select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">📚 Select category</option>
                    {categories.map(cat => (
                        <option key={cat.category_id} value={cat.category_id}>
                            {cat.name}
                        </option>
                    ))}
                </Select>
                <Button onClick={handleSearch}>Search</Button>
            </InputsContainer>
            {error && <Error>{error}</Error>}
            <ResultsContainer>
                <ResultsList>
                    {books.map(book => (
                        <ResultItem key={book.book_id}>
                            📖 {book.title} - ✍️ {book.author} - 📘 Category: {book.category_name}
                        </ResultItem>
                    ))}
                </ResultsList>
            </ResultsContainer>
        </Container>
    );
};

// Styled Components (same as before)
const Container = styled.div`
    text-align: center;
    padding: 20px;
    max-width: 800px;
    margin: auto;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
    font-size: 2em;
    margin: 0 0 20px;
`;

const InputsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Input = styled.input`
    font-size: 1em;
    padding: 10px;
    margin: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
`;

const Select = styled.select`
    font-size: 1em;
    padding: 10px;
    margin: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
`;

const Button = styled.button`
    font-size: 1em;
    padding: 10px 20px;
    margin: 10px;
    border-radius: 4px;
    border: none;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #0056b3;
    }
`;

const Error = styled.div`
    color: red;
    font-weight: bold;
    margin-top: 20px;
`;

const ResultsContainer = styled.div`
    margin-top: 20px;
`;

const ResultsList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const ResultItem = styled.li`
    font-size: 1.2em;
    margin-bottom: 10px;
`;

export default SearchBooks;
