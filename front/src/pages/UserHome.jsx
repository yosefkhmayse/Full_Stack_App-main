import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f4f4f9;
    min-height: 100vh;
`;

const Nav = styled.nav`
    width: 100%;
    background-color: #4CAF50;
    padding: 10px 20px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const NavList = styled.ul`
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
`;

const NavItem = styled.li`
    margin: 0 15px;
`;

const NavLink = styled(Link)`
    color: white;
    text-decoration: none;
    font-weight: bold;
    &:hover {
        text-decoration: underline;
    }
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    color: white;
`;

const UserName = styled.span`
    margin-right: 10px;
`;


const Main = styled.main`
    text-align: center;
    margin-top: 20px;
`;

const Heading = styled.h1`
    color: #333;
    font-size: 2rem;
    margin-bottom: 10px;
`;

const Paragraph = styled.p`
    color: #666;
    font-size: 1.2rem;
`;

const UserHome = () => {
    return (
        <Container>
            <Nav>
                <div>
                <NavItem><NavLink to="/">🔒 התנתק</NavLink></NavItem>
                </div>
                <NavList>
                    <NavItem><NavLink to="/userhome">🏠 דף הבית</NavLink></NavItem>
                    <NavItem><NavLink to="/booklist">📚 הצג ספרים</NavLink></NavItem>
                    <NavItem><NavLink to="/userloans">💼 ניהול הלוואות</NavLink></NavItem>
                    <NavItem><NavLink to="/settings">👤 הפרופיל שלי</NavLink></NavItem>
                </NavList>
                <UserInfo>
                    <UserName>שלום</UserName>
                </UserInfo>
            </Nav>
            <Main>
                <Heading>ברוכים הבאים למערכת ניהול הספריה</Heading>
                <Paragraph>בחר אפשרות מהתפריט העליון כדי להתחיל.</Paragraph>
            </Main>
        </Container>
    );
};

export default UserHome;
