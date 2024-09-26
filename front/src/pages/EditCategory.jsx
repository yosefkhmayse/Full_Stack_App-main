import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const EditCategory = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/categories?id=${id}`)
            .then(response => setCategory(response.data))
            .catch(error => console.error('שגיאה בטעינת הקטגוריה:', error));
    }, [id]);

    const handleChange = (e) => {
        setCategory({ ...category, name: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`/categories/${id}`, category)
            .then(() => navigate('/categories'))
            .catch(error => console.error('שגיאה בעדכון הקטגוריה:', error));
    };

    if (!category) return <Loading>🔄 טוען...</Loading>;

    return (
        <PageContainer>
            <FormContainer>
                <Title>✏️ ערוך קטגוריה</Title>
                <Form onSubmit={handleSubmit}>
                    <Label>
                        📛 שם קטגוריה:
                        <Input
                            type="text"
                            value={category.name}
                            onChange={handleChange}
                            required
                            placeholder="הזן שם קטגוריה"
                        />
                    </Label>
                    <SubmitButton type="submit">✔️ עדכן קטגוריה</SubmitButton>
                </Form>
            </FormContainer>
        </PageContainer>
    );
};

export default EditCategory;

// רכיבים מעוצבים
const PageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
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

const Loading = styled.div`
    font-size: 1.2em;
    color: #555;
`;
