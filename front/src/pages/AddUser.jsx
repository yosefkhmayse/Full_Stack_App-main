import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const AddUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/users', { username, password, email, role })
            .then(() => navigate('/users'))
            .catch(error => console.error('שגיאה בהוספת משתמש 🛑:', error));
    };

    return (
        <PageContainer>
            <ContentBox>
                <Header>הוסף משתמש חדש 🆕</Header>
                <Form onSubmit={handleSubmit}>
                    <Label>
                        שם משתמש 🧑‍💻:
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Label>
                    <Label>
                        סיסמה 🔒:
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Label>
                    <Label>
                        אימייל 📧:
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Label>
                    <Label>
                        תפקיד 🎭:
                        <Select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="user">משתמש 👤</option>
                            <option value="student_college">תלמיד במוסד לימודים 🎓</option>
                            <option value="student_school">תלמיד בבית ספר 🏫</option>
                        </Select>
                    </Label>
                    <SubmitButton type="submit">הוסף משתמש 📥</SubmitButton>
                </Form>
            </ContentBox>
        </PageContainer>
    );
};

export default AddUser;

// רכיבי עיצוב
const PageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
`;

const ContentBox = styled.div`
    width: 100%;
    max-width: 500px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
`;

const Header = styled.h1`
    font-size: 2em;
    color: #333;
    margin-bottom: 20px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Label = styled.label`
    display: flex;
    flex-direction: column;
    font-size: 1em;
    color: #555;
`;

const Input = styled.input`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-top: 5px;
    font-size: 1em;
`;

const Select = styled.select`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-top: 5px;
    font-size: 1em;
`;

const SubmitButton = styled.button`
    padding: 10px 15px;
    background-color: #00aaff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;

    &:hover {
        background-color: #0088cc;
    }
`;
