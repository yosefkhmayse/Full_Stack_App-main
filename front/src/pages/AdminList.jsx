import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const AdminList = () => {
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await axios.get('/admins');
                setAdmins(response.data);
            } catch (error) {
                console.error('🛑 שגיאה בטעינת מנהלים:', error);
            }
        };

        fetchAdmins();
    }, []);

    const deleteAdmin = async (id) => {
        try {
            await axios.delete(`/admins/${id}`);
            setAdmins(admins.filter(admin => admin.id !== id));
        } catch (error) {
            console.error('🚨 שגיאה בהסרת מנהל:', error);
        }
    };

    return (
        <PageContainer>
            <Container>
                <Header>
                    <LibraryName>📚 ספרייה</LibraryName>
                    <LogoutLink to="/">🚪 יציאה</LogoutLink>
                    <Title>📋 רשימת מנהלים</Title>
                    <AddAdminLink to="/add-admin">➕ הוסף מנהל חדש</AddAdminLink>
                </Header>
                <AdminListContainer>
                    <ul>
                        {admins.map(admin => (
                            <AdminItem key={admin.id}>
                                <AdminInfo>
                                    <div>
                                        <Label>📝 שם משתמש: </Label>
                                        <Value>{admin.username}</Value>
                                    </div>
                                    <div>
                                        <Label>📧 אימייל: </Label>
                                        <Value>{admin.email}</Value>
                                    </div>
                                    <div>
                                        <Label>🏷️ תפקיד: </Label>
                                        <Value>{admin.role}</Value>
                                    </div>
                                </AdminInfo>
                                <AdminActions>
                                    <ActionLink to={`/edit-admin/${admin.id}`}>✏️ ערוך</ActionLink>
                                    <ActionButton onClick={() => deleteAdmin(admin.id)}>❌ מחק</ActionButton>
                                </AdminActions>
                            </AdminItem>
                        ))}
                    </ul>
                </AdminListContainer>
            </Container>
        </PageContainer>
    );
};

export default AdminList;

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
    max-width: 800px;
    width: 100%;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    gap: 10px;
`;

const LibraryName = styled.h1`
    font-size: 2.5em;
    color: #333;
    text-align: center;
    margin: 10px 0;
`;

const LogoutLink = styled(Link)`
    align-self: flex-start;
    font-size: 1.2em;
    color: #007bff;
    text-decoration: none;
    
    &:hover {
        text-decoration: underline;
    }
`;

const Title = styled.h2`
    font-size: 2em;
    color: #333;
    margin: 10px 0;
`;

const AddAdminLink = styled(Link)`
    font-size: 1.2em;
    color: #28a745;
    text-decoration: none;
    
    &:hover {
        text-decoration: underline;
    }
`;

const AdminListContainer = styled.div`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
`;

const AdminItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #ddd;
    
    &:last-child {
        border-bottom: none;
    }
`;

const AdminInfo = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const Label = styled.span`
    font-weight: bold;
    margin-right: 5px;
`;

const Value = styled.span`
    font-size: 1em;
    word-wrap: break-word; /* Ensure email addresses are visible and do not overflow */
`;

const AdminActions = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`;

const ActionLink = styled(Link)`
    color: #007bff;
    text-decoration: none;
    
    &:hover {
        text-decoration: underline;
    }
`;

const ActionButton = styled.button`
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
        background-color: #c82333;
    }
`;
