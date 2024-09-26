import React, { useState } from 'react';
import { useBigAdminAuth } from '../context/BigAdminContext'; // התאם את הנתיב לפי הצורך
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import cameraImage from '../images/login.jpg'; // ייבוא התמונה

const BigAdminLoginPage = () => {
    const { login } = useBigAdminAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('🛑 שם משתמש וסיסמה נדרשים');
            return;
        }
        try {
            await login({ username, password });
            setMessage('✅ ההתחברות בוצעה בהצלחה');
            setError('');
            navigate('/admins'); // הפניה לדף הבית של בעלי הספריות לאחר התחברות מוצלחת
        } catch (err) {
            setError(err.message || '🚨 שגיאה בשרת');
            setMessage('');
        }
    };

    return (
        <Container>
            <ImageSection>
                <img src={cameraImage} alt="תמונה" />
            </ImageSection>
            <ContentSection>
                <Title>📚 התחברות לבעל הספרייה</Title>
                <form onSubmit={handleLogin}>
                    <FormGroup>
                        <Label>שם בעל הספרייה:</Label>
                        <Input
                            type="text"
                            placeholder="הכנס שם בעל הספרייה"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>סיסמה:</Label>
                        <Input
                            type="password"
                            placeholder="הכנס סיסמה"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <SubmitButton type="submit">
                        🔑 התחבר
                    </SubmitButton>
                    {error && <Error>{error}</Error>}
                    {message && <Message>{message}</Message>}
                </form>
            </ContentSection>
        </Container>
    );
};

export default BigAdminLoginPage;

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
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h1`
    font-size: 2.5em;
    color: #333;
    margin-bottom: 30px;
    text-align: center;
`;

const FormGroup = styled.div`
    margin-bottom: 20px;
    width: 100%;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #333;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    font-size: 1em;
`;

const SubmitButton = styled.button`
    padding: 15px;
    background-color: #00aaff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.2em;
    cursor: pointer;
    width: 100%;
    text-align: center;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
        background-color: #0088cc;
        transform: translateY(-5px);
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 10px rgba(0, 170, 255, 0.5);
    }
`;

const Error = styled.p`
    color: red;
    margin-top: 10px;
    text-align: center;
`;

const Message = styled.p`
    color: green;
    margin-top: 10px;
    text-align: center;
`;
