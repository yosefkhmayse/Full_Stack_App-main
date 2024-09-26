import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useUserContext } from '../context/UserContext'; // Assuming you're using UserContext for user info

const UserLoans = () => {
    const { currentUser } = useUserContext(); // Get current user
    const [loans, setLoans] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await axios.get(`/loans/user/${currentUser.id}`);
                setLoans(response.data);
            } catch (err) {
                setError('🚨 שגיאה בקבלת הלוואות: ' + (err.response ? err.response.data.error : 'שגיאת שרת'));
            }
        };

        if (currentUser) {
            fetchLoans();
        }
    }, [currentUser]);

    return (
        <Container>
            <Title>ההשאלות שלי</Title>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {loans.length === 0 ? (
                <NoLoansMessage>אין הלוואות זמינות</NoLoansMessage>
            ) : (
                <LoansList>
                    {loans.map((loan) => (
                        <LoanItem key={loan.id}>
                            <LoanDetails>ספר: {loan.book_id}</LoanDetails>
                            <LoanDetails>תאריך השאלה: {new Date(loan.loaned_date).toLocaleDateString()}</LoanDetails>
                            <LoanDetails>תאריך החזרה: {loan.returned_date ? new Date(loan.returned_date).toLocaleDateString() : 'לא הוחזר'}</LoanDetails>
                            <LoanDetails>חזר: {loan.returned ? 'כן' : 'לא'}</LoanDetails>
                        </LoanItem>
                    ))}
                </LoansList>
            )}
        </Container>
    );
};

export default UserLoans;

// Styled Components
const Container = styled.div`
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    font-size: 2em;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
`;

const LoansList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const LoanItem = styled.div`
    padding: 15px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
`;

const LoanDetails = styled.p`
    margin: 5px 0;
    color: #555;
`;

const NoLoansMessage = styled.p`
    text-align: center;
    color: #888;
`;

const ErrorMessage = styled.p`
    color: red;
    text-align: center;
`;
