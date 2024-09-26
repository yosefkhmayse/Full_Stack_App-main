import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import cameraImage from '../images/login.jpg'; // יבוא התמונה

const Login = () => {
  const navigate = useNavigate();

  const handleBigAdminLogin = () => {
    navigate('/bigadmin-login'); // מעבר לדף התחברות לבעל הספרייה
  };

  const handleAdminLogin = () => {
    navigate('/admin-login'); // מעבר לדף התחברות למנהל
  };

  const handleUserLogin = () => {
    navigate('/user-login'); // מעבר לדף התחברות למשתמש
  };

  return (
    <LoginContainer>
      <ImageSection>
        <img src={cameraImage} alt="Camera" />
      </ImageSection>
      <LoginSection>
        <Title>ספרייה</Title>
        <ButtonContainer>
          <StyledButton onClick={handleBigAdminLogin}>
            📚 התחברות לבעל הספרייה
          </StyledButton>
          <StyledButton onClick={handleAdminLogin}>
            🧑‍💼 התחברות למנהל
          </StyledButton>
          <StyledButton onClick={handleUserLogin}>
            👤 התחברות למשתמש
          </StyledButton>
        </ButtonContainer>
      </LoginSection>
    </LoginContainer>
  );
};

export default Login;

// רכיבי עיצוב
const LoginContainer = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  gap: 20px; /* התאמת הרווח בין התמונה לדף ההתחברות אם יש צורך */
`;

const ImageSection = styled.div`
  overflow: hidden;
  width: 50vw; /* התאמת רוחב אם יש צורך */
  height: 80vh; /* התאמת גובה אם יש צורך */
  img {
    width: 100%; 
    height: 100%;
    object-fit: cover; /* חיתוך התמונה בהתאם לגובה ורוחב */
  }
`;

const LoginSection = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* מרכז את התוכן אופקית */
  background-color: white;
  border-radius: 10px; /* אפשרות: הוספת זוויות מעוגלות לעיצוב */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* אפשרות: הוספת צל לעומק */
`;

const Title = styled.h1`
  font-size: 3em;
  color: #333;
  text-align: center;
  margin-bottom: 30px; /* רווח תחתון */
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px; /* רווח בין הכפתורים */
`;

const StyledButton = styled.button`
  padding: 15px 20px;
  background-color: #00aaff;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.5em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #0088cc; /* שינוי צבע כאשר העכבר מעל */
    transform: translateY(-5px); /* הזזת הכפתור מעט כלפי מעלה */
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 170, 255, 0.5); /* הוספת צל כאשר הכפתור בפוקוס */
  }
`;
