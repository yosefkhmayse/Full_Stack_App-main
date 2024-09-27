import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
const EditLoan = () => {
    const { id } = useParams();
    const [loan, setLoan] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/loans/${id}`)
            .then(response => setLoan(response.data))
            .catch(error => console.error('שגיאה בטעינת ההשאלה:', error));
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoan({
            ...loan,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`/loans/${id}`, loan)
            .then(() => navigate('/loans'))
            .catch(error => console.error('שגיאה בעדכון ההשאלה:', error));
    };

    if (!loan) return <div style={loadingStyle}>🔄 טוען...</div>;

    const formatDate = (date) => date ? date.split('T')[0] : '';

    return (
        <div style={outerContainerStyle}>
            <div style={containerStyle}>
            <Link to="/loans">
        <HomeButton> חזור  </HomeButton>
      </Link>
                <h1 style={headerStyle}>ערוך השאלה 📚</h1>
                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>
                            מזהה ספר 📖:
                            <input 
                                type="number" 
                                name="book_id" 
                                value={loan.book_id} 
                                onChange={handleChange} 
                                required 
                                style={inputStyle} 
                            />
                        </label>
                    </div>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>
                            מזהה משתמש 👤:
                            <input 
                                type="number" 
                                name="user_id" 
                                value={loan.user_id} 
                                onChange={handleChange} 
                                required 
                                style={inputStyle} 
                            />
                        </label>
                    </div>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>
                            תאריך השאלה 📅:
                            <input 
                                type="date" 
                                name="loaned_date" 
                                value={formatDate(loan.loaned_date)} 
                                onChange={handleChange} 
                                required 
                                style={inputStyle} 
                            />
                        </label>
                    </div>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>
                            תאריך החזרה 📅:
                            <input 
                                type="date" 
                                name="returned_date" 
                                value={formatDate(loan.returned_date)} 
                                onChange={handleChange} 
                                style={inputStyle} 
                            />
                        </label>
                    </div>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>
                            הוחזר ✅:
                            <input 
                                type="checkbox" 
                                name="returned" 
                                checked={loan.returned} 
                                onChange={handleChange} 
                                style={checkboxStyle} 
                            />
                        </label>
                    </div>
                    <button type="submit" style={submitButtonStyle}>עדכן השאלה ✏️</button>
                </form>
            </div>
        </div>
    );
};

export default EditLoan;

// Inline Styles
const outerContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4'
};

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
const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
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

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px'
};

const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
};

const labelStyle = {
    fontSize: '16px',
    textAlign: 'left',
    width: '100%',
    maxWidth: '400px'
};

const inputStyle = {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginTop: '5px'
};

const checkboxStyle = {
    marginTop: '5px'
};

const submitButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
};

const loadingStyle = {
    textAlign: 'center',
    fontSize: '1.5em',
    color: '#333',
    padding: '20px'
};
