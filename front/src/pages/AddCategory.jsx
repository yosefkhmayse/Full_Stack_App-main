import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AddCategory = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/categories', { name })
            .then(() => navigate('/categories'))
            .catch(error => console.error('שגיאה בהוספת קטגוריה:', error));
    };

    return (
        <PageContainer>
            <FormContainer>
            <Link to="/categories">
        <HomeButton>🏠 חזור לדף הבית</HomeButton>
      </Link>
                <Title>➕ הוסף קטגוריה חדשה</Title>
                <Form onSubmit={handleSubmit}>
                    <Label>
                        📛 שם קטגוריה:
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="הזן שם קטגוריה"
                        />
                    </Label>
                    <SubmitButton type="submit">✔️ הוסף קטגוריה</SubmitButton>
                </Form>
            </FormContainer>
        </PageContainer>
    );
};

export default AddCategory;

// Styled Components
const PageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
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

const FormContainer = styled.div`
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
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
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1.2em;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #218838;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
    }
`;
