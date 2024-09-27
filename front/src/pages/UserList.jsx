import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('שגיאה בטעינת המשתמשים 🛑:', error));
    }, []);

    const deleteUser = (id) => {
        axios.delete(`/users/${id}`)
            .then(() => setUsers(users.filter(user => user.id !== id)))
            .catch(error => console.error('שגיאה במחיקת המשתמש 🛑:', error));
    };

    return (
        <PageContainer>
            <ContentBox>
            <Link to="/adminhome">
                    <HomeButton>🏠 חזור לדף הבית</HomeButton>
                </Link>
                <Header>רשימת משתמשים 👥</Header>
                <AddUserLink to="/add-user">הוסף משתמש חדש ➕</AddUserLink>
                <Table>
                    <thead>
                        <tr>
                            <Th>ID</Th>
                            <Th>שם משתמש 🧑‍💻</Th>
                            <Th>אימייל 📧</Th>
                            <Th>תפקיד 🎭</Th>
                            <Th>פעולות 🔧</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <Td>{user.id}</Td>
                                <Td>{user.username}</Td>
                                <Td>{user.email}</Td>
                                <Td>{user.role}</Td>
                                <Td>
                                    <EditButton to={`/edit-user/${user.id}`}>ערוך ✏️</EditButton>
                                    <DeleteButton onClick={() => deleteUser(user.id)}>מחק 🗑️</DeleteButton>
                                </Td>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </ContentBox>
        </PageContainer>
    );
};

export default UserList;

// Styled Components
const PageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
`;

const ContentBox = styled.div`
    width: 100%;
    max-width: 900px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
`;

const Header = styled.h1`
    font-size: 2.5em;
    color: #333;
    margin-bottom: 20px;
`;

const AddUserLink = styled(Link)`
    display: inline-block;
    padding: 10px 20px;
    margin-bottom: 20px;
    background-color: #00aaff;
    color: white;
    border-radius: 5px;
    text-decoration: none;
    font-size: 1.2em;

    &:hover {
        background-color: #0088cc;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
`;

const Th = styled.th`
    padding: 10px;
    background-color: #f4f4f4;
    border-bottom: 2px solid #ddd;
    font-weight: bold;
`;

const Td = styled.td`
    padding: 10px;
    border-bottom: 1px solid #ddd;
`;

const TableRow = styled.tr`
    &:last-child ${Td} {
        border-bottom: none;
    }
`;

const EditButton = styled(Link)`
    padding: 5px 10px;
    background-color: #4caf50;
    color: white;
    border-radius: 5px;
    text-decoration: none;
    font-size: 0.9em;
    margin-right: 5px;

    &:hover {
        background-color: #45a049;
    }
`;

const DeleteButton = styled.button`
    padding: 5px 10px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9em;

    &:hover {
        background-color: #e53935;
    }
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