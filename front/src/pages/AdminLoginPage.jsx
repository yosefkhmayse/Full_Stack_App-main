import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminContext'; // התאם את הנתיב לפי הצורך
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import cameraImage from '../images/login.jpg'; // ייבוא התמונה

const AdminLoginPage = () => {
    const { login } = useAdminAuth();
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
            navigate('/adminhome'); // הפניה לדף הבית של המנהל לאחר התחברות מוצלחת
        } catch (err) {
            setError(err.message || '🚨 שגיאה בשרת');
            setMessage('');
        }
    };

    return (
        <Container>
            <ImageSection>
                <img src={cameraImage} alt="Camera" />
            </ImageSection>
            <ContentSection>
                <Title>👤 התחברות למנהל</Title>
                <form onSubmit={handleLogin}>
                    <FormGroup>
                        <Label>👤 שם מנהל:</Label>
                        <Input
                            type="text"
                            placeholder="הכנס שם מנהל"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>🔒 סיסמה:</Label>
                        <Input
                            type="password"
                            placeholder="הכנס סיסמה"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <Button type="submit">
                        🔑 התחבר
                    </Button>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {message && <SuccessMessage>{message}</SuccessMessage>}
                </form>
            </ContentSection>
        </Container>
    );
};

export default AdminLoginPage;

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
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1em;
`;

const Button = styled.button`
    padding: 15px 20px;
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
    width: 100%;

    &:hover {
        background-color: #0088cc;
        transform: translateY(-5px);
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 10px rgba(0, 170, 255, 0.5);
    }
`;

const ErrorMessage = styled.p`
    color: red;
    text-align: center;
`;

const SuccessMessage = styled.p`
    color: green;
    text-align: center;
`;
