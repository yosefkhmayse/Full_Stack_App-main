import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddLoan = () => {
    const [loan, setLoan] = useState({
        book_id: '',
        user_id: '',
        loaned_date: '',
        returned_date: '',
        returned: false
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoan({
            ...loan,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/loans', loan)
            .then(() => navigate('/loans'))
            .catch(error => console.error('שגיאה בהוספת השאלה:', error));
    };

    return (
        <div style={outerContainerStyle}>
            <div style={containerStyle}>
                <h1 style={headerStyle}>הוסף השאלה חדשה 📚</h1>
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
                                value={loan.loaned_date} 
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
                                value={loan.returned_date} 
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
                    <button type="submit" style={buttonStyle}>הוסף השאלה ➕</button>
                </form>
            </div>
        </div>
    );
};

export default AddLoan;

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
    maxWidth: '500px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' // Center the text and content
};

const headerStyle = {
    fontSize: '2em',
    marginBottom: '20px',
    color: '#333'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
};

const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
};

const labelStyle = {
    fontSize: '16px'
};

const inputStyle = {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc'
};

const checkboxStyle = {
    marginTop: '5px'
};

const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: '#00aaff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    textAlign: 'center'
};
