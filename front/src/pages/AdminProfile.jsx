import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useParams } from 'react-router-dom'; // ייבוא useParams כדי לקבל פרמטרים מהנתיב

const AdminProfile = () => {
    const { id } = useParams(); // קבלת מזהה המנהל מפרמטרי הנתיב
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await axios.get(`/admins/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setAdmin(response.data);
            } catch (err) {
                setError('כשלון בטעינת נתוני המנהל.');
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();
    }, [id]);

    if (loading) return <LoadingText>טוען...</LoadingText>;
    if (error) return <ErrorText>{error}</ErrorText>;

    return (
        <Container>
            <Title>👤 פרופיל מנהל</Title>
            {admin && (
                <ProfileDetails>
                    <Detail><strong>שם משתמש:</strong> {admin.username}</Detail>
                    <Detail><strong>אימייל:</strong> {admin.email}</Detail>
                    {/* הוסף פרטים נוספים על הפרופיל לפי הצורך */}
                </ProfileDetails>
            )}
        </Container>
    );
};

export default AdminProfile;

// Styled Components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: auto;
`;

const Title = styled.h1`
    font-size: 2.5em;
    color: #333;
    margin-bottom: 20px;
`;

const ProfileDetails = styled.div`
    width: 100%;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Detail = styled.p`
    font-size: 1.2em;
    color: #555;
    margin: 10px 0;
`;

const LoadingText = styled.p`
    font-size: 1.2em;
    color: #007bff;
    text-align: center;
`;

const ErrorText = styled.p`
    font-size: 1.2em;
    color: red;
    text-align: center;
`;
