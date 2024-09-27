import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { useUserContext } from '../context/UserContext';

const UserSettings = () => {
    const { user } = useUserContext(); // Get user from context
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [userName, setUserName] = useState('');

    // Fetch the user's name based on their ID
    const fetchUserName = useCallback(async () => {
        if (!user || !user.id) {
            console.warn('User not identified, skipping name fetch.');
            setError('חובה להתחבר כדי לראות את השם.');
            return;
        }

        try {
            const response = await axios.get(`/users/${user.id}`);
            console.log('User data fetched:', response.data); // Debugging line
            setUserName(response.data.username); // Update to 'username'
        } catch (err) {
            console.error('Error fetching user name:', err);
            setError('🚨 שגיאה בקבלת שם המשתמש: ' + (err.response ? err.response.data.error : 'שגיאת שרת'));
        }
    }, [user]);

    useEffect(() => {
        fetchUserName();
    }, [fetchUserName]);

    // Handle password change
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (newPassword !== confirmPassword) {
            setError('הסיסמאות אינן תואמות');
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('לא נמצא אסימון אימות.');
                return;
            }
    
            // Log passwords before sending to the server (for debugging)
            console.log('Current Password:', currentPassword);
            console.log('New Password:', newPassword);
    
            const response = await axios.post('/users/change-password', {
                currentPassword,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            console.log('Password change response:', response.data); // Debugging line
            setMessage('הסיסמה שונתה בהצלחה');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError(''); // Clear the error message
        } catch (err) {
            console.error('Password change failed:', err);
            const errorMessage = err.response && err.response.data && err.response.data.error
                ? err.response.data.error
                : 'שגיאה בשרת';
            setError('שינוי הסיסמה נכשל: ' + errorMessage);
        }
    };
    
    return (
        <OuterContainer>
            <Container>
            <Link to="/userhome">
                    <HomeButton>🏠 חזור לדף הבית</HomeButton>
                </Link>
                <h1>👤 שלום, {userName || 'טוען...'}!</h1> {/* Display the username */}
                <h2>🔒 שנה סיסמה</h2>
                <form onSubmit={handleSubmit}>
                    <InputGroup>
                        <label>
                            סיסמה נוכחית 🔑:
                            <Input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </label>
                    </InputGroup>
                    <InputGroup>
                        <label>
                            סיסמה חדשה 🔐:
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </label>
                    </InputGroup>
                    <InputGroup>
                        <label>
                            אשר סיסמה חדשה 🔒:
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </label>
                    </InputGroup>
                    <Button type="submit">🔄 שנה סיסמה</Button>
                </form>
                {message && <Message>{message}</Message>}
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Container>
        </OuterContainer>
    );
};

export default UserSettings;

// Styled Components (Reusing the same as your provided code)
const OuterContainer = styled.div`
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

const Container = styled.div`
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
    text-align: center;
`;

const InputGroup = styled.div`
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    text-align: center;
`;

const Input = styled.input`
    padding: 8px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-top: 5px;
`;

const Button = styled.button`
    padding: 10px 15px;
    background-color: #279af9;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
`;

const Message = styled.p`
    color: green;
    text-align: center;
    margin-top: 10px;
`;

const ErrorMessage = styled.p`
    color: red;
    text-align: center;
    margin-top: 10px;
`;
