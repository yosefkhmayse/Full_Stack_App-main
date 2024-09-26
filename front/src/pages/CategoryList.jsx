import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('שגיאה בטעינת הקטגוריות:', error));
    }, []);

    const deleteCategory = (id) => {
        axios.delete(`/categories/${id}`)
            .then(() => setCategories(categories.filter(category => category.id !== id)))
            .catch(error => console.error('שגיאה במחיקת הקטגוריה:', error));
    };

    return (
        <PageContainer>
            <ContentBox>
                <Header>📚 רשימת קטגוריות</Header>
                <AddCategoryLink to="/add-category">➕ הוסף קטגוריה חדשה</AddCategoryLink>
                <CategoryListContainer>
                    {categories.map(category => (
                        <CategoryItem key={category.id}>
                            {category.name}
                            <Actions>
                                <EditButton to={`/edit-category/${category.id}`}>✏️ ערוך</EditButton>
                                <DeleteButton onClick={() => deleteCategory(category.id)}>🗑️ מחק</DeleteButton>
                            </Actions>
                        </CategoryItem>
                    ))}
                </CategoryListContainer>
            </ContentBox>
        </PageContainer>
    );
};

export default CategoryList;

// רכיבים מעוצבים
const PageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
`;

const ContentBox = styled.div`
    width: 100%;
    max-width: 800px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
`;

const Header = styled.h1`
    font-size: 2.5em;
    color: #333;
    margin-bottom: 20px;
`;

const AddCategoryLink = styled(Link)`
    display: inline-block;
    padding: 10px 20px;
    margin-bottom: 20px;
    background-color: #00aaff;
    color: white;
    border-radius: 5px;
    text-decoration: none;
    text-align: center;
    font-size: 1.2em;

    &:hover {
        background-color: #0088cc;
    }
`;

const CategoryListContainer = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
`;

const CategoryItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #ddd;
    background-color: #f9f9f9;
    border-radius: 5px;

    &:last-child {
        border-bottom: none;
    }
`;

const Actions = styled.div`
    display: flex;
    gap: 10px;
`;

const EditButton = styled(Link)`
    padding: 5px 10px;
    background-color: #4caf50;
    color: white;
    border-radius: 5px;
    text-decoration: none;
    font-size: 0.9em;

    &:hover {
        background-color: #45a049;
    }
`;

const DeleteButton = styled.button`
    padding: 5px 10px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9em;

    &:hover {
        background-color: #e53935;
    }
`;
