import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import loginImage from '../images/login.jpg'; // ייבוא התמונה

const UserLoginPage = () => {
  const { login } = useUserContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔍 ניסיון התחברות:', { username, password }); // לוג לבדיקת ניפוי
    try {
      await login(username, password);
      console.log('✅ ההתחברות הצליחה'); // לוג לבדיקת ניפוי
      navigate('/userhome'); // הפניה לאחר התחברות מוצלחת
    } catch (err) {
      console.error('❌ שגיאת התחברות:', err.message); // לוג לבדיקת ניפוי
      setError(err.message || '🚨 נכשלת להתחבר. אנא בדוק את הפרטים שלך.');
    }
  };

  return (
    <Container>
      <ImageSection>
        <img src={loginImage} alt="Login" />
      </ImageSection>
      <ContentSection>
        <Title>🔑 התחברות</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>👤 שם משתמש:</Label>
            <Input
              type="text"
              placeholder="הכנס את שם המשתמש שלך"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>🔒 סיסמה:</Label>
            <Input
              type="password"
              placeholder="הכנס את הסיסמה שלך"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          <Button type="submit">
            🚀 התחבר
          </Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Footer>
            📚 אין לך חשבון? <LinkStyled to="/register">הירשם כאן</LinkStyled>
          </Footer>
        </form>
      </ContentSection>
    </Container>
  );
};

export default UserLoginPage;

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const ImageSection = styled.div`
  width: 50vw;
  height: 80vh;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ContentSection = styled.div`
  padding: 40px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 2.5em;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1em;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #00aaff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #0088cc;
    transform: translateY(-5px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 0, 255, 0.5);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 10px;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const LinkStyled = styled(Link)`
  color: #00aaff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
