import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const BooksForCategory = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [booksForCategory, setBooksForCategory] = useState([]);
    const [bookId, setBookId] = useState('');
    const [addError, setAddError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchBooksForCategory = async () => {
            if (selectedCategoryId) {
                setLoading(true);
                try {
                    const response = await axios.get(`/books-for-categories/${selectedCategoryId}`);
                    setBooksForCategory(response.data.books);
                } catch (error) {
                    console.error('Error fetching books for category:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setBooksForCategory([]); // Clear books if no category is selected
            }
        };
        fetchBooksForCategory();
    }, [selectedCategoryId]);

    const addBookToCategory = async () => {
        if (!bookId || !selectedCategoryId) {
            setAddError('אנא הכנס מזהה ספר ובחר קטגוריה. 📚');
            return;
        }
        setLoading(true);
        try {
            await axios.post('/books-for-categories', { book_id: bookId, category_id: selectedCategoryId });
            const response = await axios.get(`/books-for-categories/${selectedCategoryId}`);
            setBooksForCategory(response.data.books);
            setBookId(''); // Clear the input
            setAddError('');
        } catch (error) {
            console.error('Error adding book to category:', error.response || error);
            setAddError(error.response?.data?.details || 'נכשל בהוספת ספר לקטגוריה. 😞');
        } finally {
            setLoading(false);
        }
    };
    
    const deleteBookFromCategory = async (bookId) => {
        setLoading(true);
        try {
            // Axios DELETE request with data payload
            await axios.delete('/books-for-categories', {
                data: { book_id: bookId, category_id: selectedCategoryId }
            });
    
            // Fetch the updated list of books for the selected category
            const response = await axios.get(`/books-for-categories/${selectedCategoryId}`);
            setBooksForCategory(response.data.books);  // Update books state
        } catch (error) {
            console.error('Error deleting book from category:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const editBook = (bookId) => {
        // Navigate to a book edit page (assumes a route exists)
        window.location.href = `/edit-book/${bookId}`;
    };

    return (
        <PageContainer>
            <Header>📚 ניהול ספרים לפי קטגוריה</Header>
            {loading && <Loading>טוען...</Loading>}

            <SelectContainer>
                <Label htmlFor="category-select">בחר קטגוריה:</Label>
                <Select 
                    id="category-select"
                    value={selectedCategoryId} 
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                    <option value="">בחר קטגוריה</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </Select>
            </SelectContainer>

            <AddBookContainer>
                <Label htmlFor="book-id">מזהה ספר:</Label>
                <Input 
                    id="book-id"
                    type="text" 
                    value={bookId} 
                    onChange={(e) => setBookId(e.target.value)} 
                    placeholder="הכנס מזהה ספר" 
                />
                <AddButton onClick={addBookToCategory}>הוסף ספר 📥</AddButton>
                {addError && <Error>{addError}</Error>}
            </AddBookContainer>

            <BooksTitle>📚 ספרים בקטגוריה {selectedCategoryId}</BooksTitle>
            <BooksListContainer>
                <ul>
                    {booksForCategory.length > 0 ? (
                        booksForCategory.map(book => (
                            <BookItem key={book.id}>
                                <span>מזהה ספר: {book.id}</span>
                                <span>כותר: {book.title}</span>
                                <BookActions>
                                    <EditButton onClick={() => editBook(book.id)}>ערוך ✏️</EditButton>
                                    <DeleteButton onClick={() => deleteBookFromCategory(book.id)}>מחק 🗑️</DeleteButton>
                                </BookActions>
                            </BookItem>
                        ))
                    ) : (
                        <NoBooks>אין ספרים בקטגוריה זו</NoBooks>
                    )}
                </ul>
            </BooksListContainer>
        </PageContainer>
    );
};

export default BooksForCategory;

// Styled Components
const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    background-color: #f4f4f4;
    border-radius: 8px;
    border: 1px solid #ddd;
`;

const Header = styled.h1`
    color: #333;
    text-align: center;
    margin-bottom: 20px;
`;

const SelectContainer = styled.div`
    margin-bottom: 20px;
    width: 100%;
`;

const Label = styled.label`
    margin-bottom: 10px;
`;

const Select = styled.select`
    padding: 10px;
    width: 100%;
    max-width: 300px;
`;

const AddBookContainer = styled.div`
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Input = styled.input`
    padding: 10px;
    width: 100%;
    max-width: 300px;
`;

const AddButton = styled.button`
    margin-top: 10px;
    padding: 10px 20px;
    color: #fff;
    background-color: #007BFF;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const Error = styled.p`
    color: #dc3545;
    margin-top: 10px;
`;

const BooksTitle = styled.h2`
    color: #333;
    margin-bottom: 20px;
`;

const BooksListContainer = styled.div`
    width: 100%;
`;

const BookItem = styled.li`
    padding: 10px;
    border: 1px solid #007BFF;
    border-radius: 4px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const BookActions = styled.div`
    display: flex;
    gap: 10px;
`;

const EditButton = styled.button`
    padding: 5px 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #218838;
    }
`;

const DeleteButton = styled.button`
    padding: 5px 10px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #c82333;
    }
`;

const Loading = styled.div`
    color: #007BFF;
`;

const NoBooks = styled.p`
    color: #555;
    text-align: center;
`;
