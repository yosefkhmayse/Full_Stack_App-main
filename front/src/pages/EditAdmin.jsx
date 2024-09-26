import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const EditAdmin = () => {
    const { id } = useParams();
    const [admin, setAdmin] = useState(null);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/admins/${id}`)
            .then(response => setAdmin(response.data))
            .catch(error => {
                console.error('🛑 שגיאה בטעינת פרטי המנהל:', error);
                setError('שגיאה בטעינת פרטי המנהל');
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmin(prevAdmin => ({
            ...prevAdmin,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error message before submission
    
        // Prepare data to send
        const adminData = {
            ...admin,
            password: password ? password : admin.password, // Use existing password if not updated
        };
    
        console.log('Submitting Admin Data:', adminData); // Debugging log
    
        try {
            const response = await axios.put(`/admins/edit/${id}`, adminData);
            console.log('✅ המנהל עודכן בהצלחה:', response.data);
            navigate('/admins');
        } catch (error) {
            console.error('🚨 שגיאה בעדכון המנהל:', error.response ? error.response.data : error.message);
            setError(error.response && error.response.data && error.response.data.message 
                ? error.response.data.message 
                : 'נכשל בעדכון המנהל. אנא נסה שוב.');
        }
    };

    if (!admin) return <div>🔄 טוען...</div>;

    return (
        <PageContainer>
            <Container>
                <Title>✏️ ערוך מנהל</Title>
                <Form onSubmit={handleSubmit}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <Label>
                        📛 שם משתמש:
                        <Input
                            type="text"
                            name="username"
                            value={admin.username}
                            onChange={handleChange}
                            required
                        />
                    </Label>
                    <Label>
                        🔑 סיסמה:
                        <Input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </Label>
                    <Label>
                        📧 אימייל:
                        <Input
                            type="email"
                            name="email"
                            value={admin.email}
                            onChange={handleChange}
                            required
                        />
                    </Label>
                    <Label>
                        🏷️ תפקיד:
                        <Input
                            type="text"
                            name="role"
                            value={admin.role}
                            onChange={handleChange}
                        />
                    </Label>
                    <SubmitButton type="submit">✅ עדכן מנהל</SubmitButton>
                </Form>
            </Container>
        </PageContainer>
    );
};

export default EditAdmin;

// רכיבים מעוצבים
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

const Title = styled.h1`
    font-size: 2em;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
`;

const Form = styled.form`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
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

const ErrorMessage = styled.p`
    color: red;
    text-align: center;
`;
