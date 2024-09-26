import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import registerImage from '../images/login.jpg'; // ייבוא התמונה

const Register = () => {
    const [username, setUsername] = useState(''); // מצב עבור שם המשתמש
    const [password, setPassword] = useState(''); // מצב עבור הסיסמה
    const [email, setEmail] = useState(''); // מצב עבור האימייל
    const [error, setError] = useState(''); // מצב עבור שגיאות
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // מונע רענון הדף
        try {
            await axios.post('/auth/userregister', { username, password, email });
            navigate('/user-login'); // הפניה לדף התחברות לאחר הרשמה מוצלחת
        } catch (err) {
            setError('🚨 הרשמה נכשלה: ' + (err.response ? err.response.data.error : 'שגיאת שרת')); // טיפול בשגיאות
        }
    };

    return (
        <Container>
            <ImageSection>
                <img src={registerImage} alt="Register" />
            </ImageSection>
            <ContentSection>
                <Title>📝 הרשמה</Title>
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
                    <FormGroup>
                        <Label>📧 אימייל:</Label>
                        <Input
                            type="email"
                            placeholder="הכנס את האימייל שלך"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <Button type="submit">
                        🚀 הרשמה
                    </Button>
                    {error && <ErrorMessage>{error}</ErrorMessage>} {/* הצגת שגיאה אם יש */}
                </form>
            </ContentSection>
        </Container>
    );
};

export default Register;

// רכיבי עיצוב
const Container = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  gap: 20px; /* התאמת הרווח בין התמונה לתוכן אם יש צורך */
`;

const ImageSection = styled.div`
  width: 50vw; /* התאמת רוחב אם יש צורך */
  height: 80vh; /* התאמת גובה אם יש צורך */
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* חיתוך התמונה בהתאם לגובה ורוחב */
  }
`;

const ContentSection = styled.div`
  padding: 40px;
  background-color: white;
  border-radius: 10px; /* אפשרות: הוספת זוויות מעוגלות לעיצוב */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* אפשרות: הוספת צל לעומק */
  max-width: 400px; /* רוחב מקסימלי */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* מרכז את התוכן אופקית */
  justify-content: center; /* מרכז את התוכן אנכית */
`;

const Title = styled.h1`
  font-size: 2.5em;
  color: #333;
  text-align: center;
  margin-bottom: 30px; /* רווח תחתון */
`;

const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 20px; /* רווח בין שדות */
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
  border-radius: 8px; /* זוויות מעוגלות */
  font-size: 1em;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #00aaff; /* צבע כפתור */
  color: white;
  border: none;
  border-radius: 8px; /* זוויות מעוגלות */
  font-size: 1.2em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px; /* רווח בין טקסט לאייקון */
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #0088cc; /* שינוי צבע כאשר העכבר מעל */
    transform: translateY(-5px); /* הזזת הכפתור מעט כלפי מעלה */
  }

  &:focus {
    outline: none; /* הסרת גבול ברירת מחדל */
    box-shadow: 0 0 10px rgba(0, 170, 255, 0.5); /* הוספת צל כאשר הכפתור בפוקוס */
  }
`;

const ErrorMessage = styled.p`
  color: red; /* צבע טקסט שגיאה */
  text-align: center; /* מרכז את הטקסט */
  margin-top: 10px; /* רווח עליון */
`;
