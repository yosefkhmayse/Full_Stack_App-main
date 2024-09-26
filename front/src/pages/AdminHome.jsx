import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import StarRating from './StarRating'; // ודא לייבא את StarRating

const AdminHome = () => {
    const [books, setBooks] = useState([]);
    const [ratings, setRatings] = useState({}); // מצב לאחסון דירוגים לכל ספר

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('/books');
                const booksData = response.data;
                setBooks(booksData);
                fetchRatings(booksData);
            } catch (error) {
                console.error('🛑 שגיאה בשליפת ספרים:', error);
            }
        };

        const fetchRatings = async (booksData) => {
            try {
                const ratingsData = {};
                for (const book of booksData) {
                    const response = await axios.get(`/ratings/${book.id}`);
                    ratingsData[book.id] = response.data.averageRating || 0;
                }
                setRatings(ratingsData);
            } catch (error) {
                console.error('🛑 שגיאה בשליפת דירוגים:', error);
            }
        };

        fetchBooks();
    }, []);

    return (
        <Container>
            <Sidebar>
                <Menu>
                    <MenuItem>
                        <LinkStyled to="/add">➕ הוסף ספר</LinkStyled>
                    </MenuItem>
                    <MenuItem>
                        <LinkStyled to="/delete-book">❌ מחק ספר</LinkStyled>
                    </MenuItem>
                    <MenuItem>
                        <LinkStyled to="/edit">✏️ ערוך ספר</LinkStyled>
                    </MenuItem>
                </Menu>
            </Sidebar>
            <MainContent>
                <Header>
                    <LibraryName>📚 ספריית כנרת</LibraryName>
                </Header>
                <BookList>
                    {books.map(book => (
                        <BookItem key={book.id}>
                            <BookImage src={book.image} alt={book.title} />
                            <BookDetails>
                                <BookTitle>{book.title}</BookTitle>
                                <BookAuthor>מאת {book.author}</BookAuthor>
                                <StarRating rating={ratings[book.id] || 0} onRatingChange={() => {}} />
                            </BookDetails>
                        </BookItem>
                    ))}
                </BookList>
            </MainContent>
        </Container>
    );
};

export default AdminHome;

// רכיבי עיצוב
const Container = styled.div`
    display: flex;
    height: 100vh;
    background-color: #f4f4f4;
`;

const Sidebar = styled.div`
    width: 250px;
    background-color: #333;
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const Menu = styled.ul`
    list-style: none;
    padding: 0;
    width: 100%;
`;

const MenuItem = styled.li`
    width: 100%;
    margin: 10px 0;
    text-align: center;
`;

const LinkStyled = styled(Link)`
    color: #fff;
    text-decoration: none;
    font-size: 1em;
    display: block;
    padding: 10px;
    border-radius: 5px;
    background-color: #444;

    &:hover {
        background-color: #555;
        text-decoration: underline;
    }
`;

const MainContent = styled.div`
    width: calc(100% - 250px);
    padding: 20px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const LibraryName = styled.h1`
    font-size: 2em;
    color: #333;
    margin: 0;
    justify-content: center;
`;

const BookList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const BookItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 10px;
    text-align: center;
`;

const BookImage = styled.img`
    width: 100%;
    height: auto;
    max-width: 150px;
    max-height: 200px;
    object-fit: cover;
    border-radius: 5px;
    margin-bottom: 10px;
`;

const BookDetails = styled.div`
    flex: 1;
`;

const BookTitle = styled.h2`
    margin: 0;
    font-size: 1.1em;
    color: #333;
`;

const BookAuthor = styled.p`
    margin: 0;
    color: #555;
`;
