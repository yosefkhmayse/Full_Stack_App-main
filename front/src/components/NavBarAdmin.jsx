import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Navbaradmin = ({ adminId }) => {
  return (
    <Navbar>
      <Container>
        <Links>
          <NavLink to="/">
            🚪 יציאה
          </NavLink>
          <NavLink to="/books">
            📚 ניהול ספרים
          </NavLink>
          <NavLink to="/users">
            👤 ניהול משתמשים
          </NavLink>
          <NavLink to="/categories">
            📂 ניהול קטגוריות
          </NavLink>
          <NavLink to="/loans">
            📅 ניהול השאלות
          </NavLink>
          <NavLink to="/category">
            📖 ניהול ספרים לקטגוריות
          </NavLink>
        </Links>
      </Container>
    </Navbar>
  );
};

export default Navbaradmin;

// Styled Components
const Navbar = styled.div`
  width: 100%;
  background-color: #333;
  color: white;
  padding: 10px 0;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Links = styled.div`
  display: flex;
  gap: 15px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background-color: #444;
  }
`;
