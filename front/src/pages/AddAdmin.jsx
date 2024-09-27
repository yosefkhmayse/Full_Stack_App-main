import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AddAdmin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error message before submission
        try {
            await axios.post('/admins', { username, password, email, role });
            navigate('/admins'); // Navigate to the admins page on success
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); // Display error message from server
            } else {
                setError('נכשל בהוספת מנהל. אנא נסה שוב.'); // Generic error message
            }
        }
    };

    return (
        <PageContainer>
            <Container>
            <Link to="/admins">
        <HomeButton>🏠 חזור לדף הבית</HomeButton>
      </Link>
                <Title>➕ הוסף מנהל חדש</Title>
                <Form onSubmit={handleSubmit}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <Label>
                        👤 שם מנהל:
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="הזן שם מנהל"
                        />
                    </Label>
                    <Label>
                        🔑 סיסמה:
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="הזן סיסמה"
                        />
                    </Label>
                    <Label>
                        📧 אימייל:
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="הזן אימייל"
                        />
                    </Label>
                    <Label>
                        🏷️ תפקיד:
                        <Input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="הזן תפקיד (אופציונלי)"
                        />
                    </Label>
                    <SubmitButton type="submit">✔️ הוסף מנהל</SubmitButton>
                </Form>
            </Container>
        </PageContainer>
    );
};

export default AddAdmin;

// Styled Components
const PageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
`;

const Container = styled.div`
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
`;
const HomeButton = styled.button`
  padding: 10px 15px;
  background-color: #142e99;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    background-color: #0f1e66; /* Darker shade on hover */
  }
`;
const Title = styled.h1`
    font-size: 2em;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Label = styled.label`
    display: block;
    font-size: 1.1em;
    color: #555;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const SubmitButton = styled.button`
    padding: 15px;
    background-color: #279af9;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1.2em;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: blue;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
    }
`;

const ErrorMessage = styled.p`
    color: red;
    text-align: center;
`;
