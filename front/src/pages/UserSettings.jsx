import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const UserSettings = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('הסיסמאות אינן תואמות');
            return;
        }

        try {
            await axios.post('/users/change-password', {
                currentPassword,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessage('הסיסמה שונתה בהצלחה');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError('שינוי הסיסמה נכשל: ' + (err.response ? err.response.data.error : 'שגיאה בשרת'));
        }
    };

    return (
        <Container>
            <Nav>
                <NavList>
                    <NavItem><NavLink to="/adminhome">🏠 דף הבית</NavLink></NavItem>
                    <NavItem><NavLink to="/books">📚 צפה בספרים</NavLink></NavItem>
                    <NavItem><NavLink to="/loans">📖 נהל הלוואות</NavLink></NavItem>
                    <NavItem><NavLink to="/settings">⚙️ הגדרות</NavLink></NavItem>
                </NavList>
            </Nav>
            <MainContent>
                <Title>🔒 שנה סיסמה</Title>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>🔑 סיסמה נוכחית:</Label>
                        <Input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>🔐 סיסמה חדשה:</Label>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>🔒 אישור סיסמה חדשה:</Label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <SubmitButton type="submit">🔄 שנה סיסמה</SubmitButton>
                    {message && <Message>{message}</Message>}
                    {error && <Error>{error}</Error>}
                </Form>
            </MainContent>
        </Container>
    );
};

export default UserSettings;

// Styled Components
const Container = styled.div`
    display: flex;
    height: 100vh;
    background-color: #f4f4f4;
`;

const Nav = styled.nav`
    width: 250px;
    background-color: #333;
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const NavList = styled.ul`
    list-style: none;
    padding: 0;
    width: 100%;
`;

const NavItem = styled.li`
    width: 100%;
    margin: 10px 0;
    text-align: center;
`;

const NavLink = styled(Link)`
    color: #fff;
    text-decoration: none;
    font-size: 1.2em;
    display: block;
    padding: 10px;
    border-radius: 5px;
    background-color: #444;

    &:hover {
        background-color: #555;
        text-decoration: underline;
    }
`;

const MainContent = styled.div`
    width: calc(100% - 250px);
    padding: 20px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h1`
    font-size: 2em;
    color: #333;
    margin-bottom: 20px;
`;

const Form = styled.form`
    width: 100%;
    max-width: 500px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
    margin-bottom: 15px;
`;

const Label = styled.label`
    display: block;
    font-size: 1.2em;
    margin-bottom: 5px;
    color: #333;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1em;
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
        background-color: #0056b3;
        transform: translateY(-4px);
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
    }
`;

const Message = styled.p`
    color: green;
    text-align: center;
    margin-top: 10px;
`;

const Error = styled.p`
    color: red;
    text-align: center;
    margin-top: 10px;
`;
