import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment'; // For date formatting

const LoanList = () => {
    const [loans, setLoans] = useState([]);
    const [users, setUsers] = useState({}); // State for user mapping

    useEffect(() => {
        // Fetch loans
        axios.get('/loans')
            .then(response => setLoans(response.data))
            .catch(error => console.error('שגיאה בטעינת ההשאלות:', error));

        // Fetch users
        axios.get('/users') // Adjust the endpoint as necessary
            .then(response => {
                const userMap = {};
                response.data.forEach(user => {
                    userMap[user.id] = user.username; // Assuming user has an id and username
                });
                setUsers(userMap);
            })
            .catch(error => console.error('שגיאה בטעינת המשתמשים:', error));
    }, []);

    const deleteLoan = (id) => {
        axios.delete(`/loans/${id}`)
            .then(() => setLoans(loans.filter(loan => loan.id !== id)))
            .catch(error => console.error('שגיאה במחיקת השאלה:', error));
    };

    return (
        <div style={outerContainerStyle}>
            <div style={containerStyle}>
                <h1 style={headerStyle}>רשימת השאלות 📚</h1>
                <Link to="/add-loan" style={linkStyle}>הוסף השאלה חדשה ➕</Link>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th>מזהה ספר 📖</th>
                            <th>מזהה משתמש 👤</th>
                            <th>שם משתמש</th>
                            <th>תאריך השאלה 📅</th>
                            <th>תאריך החזרה 📅</th>
                            <th>הוחזר ✅</th>
                            <th>פעולות ⚙️</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map(loan => (
                            <tr key={loan.id}>
                                <td>{loan.book_id}</td>
                                <td>{loan.user_id}</td> {/* Display User ID */}
                                <td>{users[loan.user_id] || 'לא נמצא'}</td> {/* Display User Name */}
                                <td>{moment(loan.loaned_date).format('DD/MM/YYYY')}</td>
                                <td>{loan.returned_date ? moment(loan.returned_date).format('DD/MM/YYYY') : 'לא הוחזר עדיין'}</td>
                                <td>{loan.returned ? 'כן ✅' : 'לא ❌'}</td>
                                <td>
                                    <Link to={`/edit-loan/${loan.id}`} style={editButtonStyle}>ערוך ✏️</Link>
                                    <button onClick={() => deleteLoan(loan.id)} style={deleteButtonStyle}>מחק ❌</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LoanList;

// Inline Styles
const outerContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4'
};

const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
};

const headerStyle = {
    fontSize: '2em',
    marginBottom: '20px',
    color: '#333'
};

const linkStyle = {
    display: 'inline-block',
    padding: '10px 15px',
    marginBottom: '20px',
    backgroundColor: '#00aaff',
    color: 'white',
    borderRadius: '5px',
    textDecoration: 'none',
    textAlign: 'center',
    fontSize: '16px'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    fontSize: '16px',
    marginLeft: 'auto',
    marginRight: 'auto'
};

const editButtonStyle = {
    padding: '5px 10px',
    backgroundColor: '#4caf50',
    color: 'white',
    borderRadius: '5px',
    textDecoration: 'none',
    marginRight: '5px',
    fontSize: '14px'
};

const deleteButtonStyle = {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
};
