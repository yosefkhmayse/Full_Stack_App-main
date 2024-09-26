import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const BooksForCategory = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [booksForCategory, setBooksForCategory] = useState([]);
    const [bookId, setBookId] = useState('');
    const [addError, setAddError] = useState('');
    const [removeError, setRemoveError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get('/categories')
            .then(response => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('שגיאה בטעינת הקטגוריות:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedCategoryId) {
            setLoading(true);
            axios.get(`/books-for-categories/${selectedCategoryId}`)
                .then(response => {
                    setBooksForCategory(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('שגיאה בטעינת ספרים עבור הקטגוריה:', error);
                    setLoading(false);
                });
        }
    }, [selectedCategoryId]);

    const addBookToCategory = () => {
        if (!bookId || !selectedCategoryId) {
            setAddError('אנא הכנס מזהה ספר ובחר קטגוריה. 📚');
            return;
        }
        setLoading(true);
        axios.post('/books-for-categories', { book_id: bookId, category_id: selectedCategoryId })
            .then(() => {
                setBooksForCategory(prevBooks => [...prevBooks, { book_id: bookId, category_id: selectedCategoryId }]);
                setAddError('');
                setLoading(false);
            })
            .catch(error => {
                console.error('שגיאה בהוספת ספר לקטגוריה:', error);
                setAddError(error.response?.data?.details || 'נכשל בהוספת ספר לקטגוריה. 😞');
                setLoading(false);
            });
    };

    const removeBookFromCategory = (bookId) => {
        if (!selectedCategoryId) {
            setRemoveError('לא נבחרה קטגוריה.');
            return;
        }
        setLoading(true);
        axios.delete('/books-for-categories', {
            data: { book_id: bookId, category_id: selectedCategoryId }
        })
        .then(() => {
            setBooksForCategory(prevBooks => prevBooks.filter(book => book.book_id !== bookId));
            setRemoveError('');
            setLoading(false);
        })
        .catch(error => {
            console.error('שגיאה בהסרת ספר מהקטגוריה:', error);
            setRemoveError(error.response?.data?.details || 'נכשל בהסרת ספר מהקטגוריה. 😞');
            setLoading(false);
        });
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
                    aria-label="בחר קטגוריה"
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

            <CategoryGrid>
                {categories.length > 0 ? (
                    categories.map(category => (
                        <CategoryCard 
                            key={category.id} 
                            onClick={() => setSelectedCategoryId(category.id)}
                            selected={category.id === selectedCategoryId}
                        >
                            {category.name}
                        </CategoryCard>
                    ))
                ) : (
                    <NoCategories>אין קטגוריות זמינות</NoCategories>
                )}
            </CategoryGrid>

            <CategoryList>
                <BooksTitle>📚 ספרים בקטגוריה {selectedCategoryId}</BooksTitle>
                <BooksListContainer>
                    <ul>
                        {booksForCategory.length > 0 ? (
                            booksForCategory.map(book => (
                                <BookItem key={book.book_id}>
                                    <span>מזהה ספר: {book.book_id}</span>
                                    <RemoveButton onClick={() => removeBookFromCategory(book.book_id)}>
                                        הסר ❌
                                    </RemoveButton>
                                </BookItem>
                            ))
                        ) : (
                            <NoBooks>אין ספרים בקטגוריה זו</NoBooks>
                        )}
                    </ul>
                </BooksListContainer>
            </CategoryList>

            {removeError && <Error>{removeError}</Error>}
        </PageContainer>
    );
};

export default BooksForCategory;

// רכיבים מעוצבים
const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    font-family: 'Arial', sans-serif;
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
    font-size: 24px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const SelectContainer = styled.div`
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 10px;
    font-size: 16px;
    color: #555;
`;

const Select = styled.select`
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
    border: 2px solid #007BFF;
    width: 100%;
    max-width: 300px;
    background-color: #fff;
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
    font-size: 16px;
    border-radius: 4px;
    border: 2px solid #007BFF;
    width: 100%;
    max-width: 300px;
    background-color: #fff;
`;

const AddButton = styled.button`
    margin-top: 10px;
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: #007BFF;
    border: 2px solid #007BFF;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, border-color 0.3s;

    &:hover {
        background-color: #0056b3;
        border-color: #0056b3;
    }
`;

const Error = styled.p`
    color: #dc3545;
    margin-top: 10px;
    font-size: 14px;
`;

const Loading = styled.div`
    color: #007BFF;
    font-size: 18px;
    margin-top: 20px;
`;

const CategoryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    width: 100%;
    margin-bottom: 20px;
`;

const CategoryCard = styled.div`
    padding: 20px;
    border: 2px solid #007BFF;
    border-radius: 8px;
    background-color: #fff;
    text-align: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    ${({ selected }) => selected && `
        background-color: #e7f1ff;
        border-color: #0056b3;
    `}
`;

const NoCategories = styled.p`
    color: #555;
    font-size: 16px;
    text-align: center;
`;

const CategoryList = styled.div`
    width: 100%;
`;

const BooksTitle = styled.h2`
    color: #333;
    margin-bottom: 20px;
`;

const BooksListContainer = styled.div`
    width: 100%;
    max-width: 800px;
    margin-bottom: 20px;
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

const RemoveButton = styled.button`
    padding: 5px 10px;
    font-size: 14px;
    color: #fff;
    background-color: #dc3545;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #c82333;
    }
`;

const NoBooks = styled.p`
    color: #555;
    font-size: 16px;
    text-align: center;
`;
