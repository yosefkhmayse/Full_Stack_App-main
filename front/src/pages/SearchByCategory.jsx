import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import StarRating from './StarRating';

const SearchByCategory = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [books, setBooks] = useState([]);
    const [ratings, setRatings] = useState({}); // State to store ratings for each book

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            const fetchBooks = async () => {
                try {
                    const response = await axios.get(`/books-for-categories/${selectedCategory}`);
                    setBooks(response.data.books || []);
                    fetchRatings(response.data.books || []);
                } catch (error) {
                    console.error('Error fetching books:', error.message);
                }
            };
            fetchBooks();
        }
    }, [selectedCategory]);

    const fetchRatings = async (booksData) => {
        try {
            const ratingsData = {};
            for (const book of booksData) {
                const response = await axios.get(`/ratings/${book.id}`);
                ratingsData[book.id] = response.data.averageRating || 0;
            }
            setRatings(ratingsData);
        } catch (err) {
            console.error('Error fetching ratings:', err);
        }
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    return (
        <PageContainer>
            <Link to="/userhome">
                <HomeButton>🏠 חזור לדף הבית</HomeButton>
            </Link>
            <Header>📚 חפש ספרים לפי קטגוריה</Header>
            <CategoryList>
                {categories.map((category) => (
                    <CategoryItem key={category.id} onClick={() => handleCategoryClick(category.id)}>
                        {category.name}
                    </CategoryItem>
                ))}
            </CategoryList>
            {selectedCategory && books.length === 0 && (
                <p>❌ לא נמצאו ספרים בקטגוריה זו.</p>
            )}
            {selectedCategory && books.length > 0 && (
                <BookGrid>
        {books.map((book) => (
          <BookItem key={book.id}>
            {book.image && (
              <BookImage src={book.image} alt={book.title} />
            )}
            <BookDetails>
              <p><strong>כותרת:</strong> {book.title}</p>
              <p><strong>מחבר:</strong> {book.author}</p>
              <p><strong>שנה:</strong> {book.year}</p>
              <p><strong>סוגה:</strong> {book.genre}</p>
              <p><strong>זמין:</strong> {book.available ? '✅ זמין' : '❌ לא זמין'}</p> {/* Display availability */}
              <StarRating rating={ratings[book.id] || 0} onRatingChange={() => {}} />
            </BookDetails>
            <BookActions>
              <Link to={`/bookdetails/${book.id}`}>📖 פרטים</Link>
            </BookActions>
          </BookItem>
        ))}

                </BookGrid>
            )}
        </PageContainer>
    );
};

export default SearchByCategory;

// Styled Components
const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f0f0;
`;

const Header = styled.h1`
    font-size: 2em;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
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

const CategoryList = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 20px 0;
`;

const CategoryItem = styled.div`
    background-color: #fff;
    padding: 15px;
    border-radius: 5px;
    margin: 5px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;

    &:hover {
        background-color: #e0e0e0;
    }
`;

const BookGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    width: 100%;
    max-width: 1200px;
`;

const BookItem = styled.div`
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    &:hover {
        transform: translateY(-5px);
    }
`;

const BookImage = styled.img`
    width: 100%;
    height: auto;
    border-radius: 8px;
`;

const BookDetails = styled.div`
    margin: 10px 0;
`;

const BookActions = styled.div`
    a {
        text-decoration: none;
        color: #007bff;
        font-size: 1.1em;

        &:hover {
            text-decoration: underline;
        }
    }
`;
