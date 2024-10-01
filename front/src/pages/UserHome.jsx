import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: #f4f4f9;
    min-height: 100vh;
`;

const Main = styled.main`
    text-align: center;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h1`
    color: #333;
    font-size: 2rem;
    margin-bottom: 10px;
`;

const Paragraph = styled.p`
    color: #666;
    font-size: 1.2rem;
    margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr); /* 5 buttons per row */
    gap: 20px; /* Space between buttons */
    margin-top: 20px; /* Space above the grid */
`;

const ButtonBox = styled.div`
    background-color: #e0e7ff; /* Light blue background */
    padding: 20px; /* Increased padding for larger boxes */
    border-radius: 10px; /* Rounded corners */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Shadow effect */
    transition: transform 0.3s;
    display: flex; /* Center content within the box */
    justify-content: center; /* Center content horizontally */
    align-items: center; /* Center content vertically */
    
    &:hover {
        transform: translateY(-3px); /* Lift effect on hover */
    }
`;

const StyledLink = styled(Link)`
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #142e99;
    color: white;
    text-decoration: none;
    font-weight: bold;
    transition: background-color 0.3s;
    display: block; /* Make the link fill the box */
    text-align: center; /* Center text */
    
    &:hover {
        background-color: #0f1e66; /* Darker shade on hover */
    }
`;

const UserHome = () => {
    return (
        <Container>
            <Main>
                <Heading>ברוכים הבאים למערכת ניהול הספריה</Heading>
                <Paragraph>בחר אפשרות מהתפריט למטה כדי להתחיל.</Paragraph>
                <ButtonContainer>
                <ButtonBox>
                        <StyledLink to="/">🔒 התנתק</StyledLink>
                    </ButtonBox>
                    <ButtonBox>
                        <StyledLink to="/settings">👤 הפרופיל שלי</StyledLink>
                    </ButtonBox>
                    <ButtonBox>
                        <StyledLink to="/userloans">💼 ניהול השאלות</StyledLink>
                    </ButtonBox>
                     
                    <ButtonBox>
                        <StyledLink to="/search-category">🔍 חיפוש קטגוריות</StyledLink>
                    </ButtonBox>
                    <ButtonBox>
                        <StyledLink to="/search-books">🔍 חיפוש ספרים</StyledLink>
                    </ButtonBox>
                    <ButtonBox>
                        <StyledLink to="/booklist">📚 הצג ספרים</StyledLink>
                    </ButtonBox>
                </ButtonContainer>
            </Main>
        </Container>
    );
};

export default UserHome;
