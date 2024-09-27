import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useUserContext } from '../context/UserContext';
import { Link } from 'react-router-dom'; // Import Link for navigation

const AddLoan = () => {
    const { user } = useUserContext(); 
    const [loan, setLoan] = useState({
        book_id: '',
        user_id: user.id,
        loaned_date: new Date().toISOString().split('T')[0], 
        returned_date: '',
        returned: false
    });
    const [loans, setLoans] = useState([]);
    const [error, setError] = useState('');
    const [editingLoanId, setEditingLoanId] = useState(null); 

    const fetchLoans = useCallback(async () => {
        if (!user || !user.id) {
            console.warn('User not identified, skipping loan fetch.');
            setError('חובה להתחבר כדי לראות הלוואות.');
            return;
        }

        try {
            const response = await axios.get(`/loans/user/${user.id}`);
            setLoans(response.data);
        } catch (err) {
            console.error('Error fetching loans:', err);
            setError('🚨 שגיאה בקבלת הלוואות: ' + (err.response ? err.response.data.error : 'שגיאת שרת'));
        }
    }, [user]);

    useEffect(() => {
        fetchLoans(); 
    }, [fetchLoans]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoan({
            ...loan,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLoanId) {
                await axios.put(`/loans/${editingLoanId}`, loan);
            } else {
                await axios.post('/loans', loan);
            }
            fetchLoans(); 
            resetLoanForm(); 
        } catch (error) {
            console.error('שגיאה בהוספת/עדכון ההשאלה:', error);
        }
    };

    const resetLoanForm = () => {
        setLoan({
            book_id: '',
            user_id: user.id,
            loaned_date: new Date().toISOString().split('T')[0],
            returned_date: '',
            returned: false
        });
        setEditingLoanId(null); 
    };

    const handleEdit = (loan) => {
        setLoan({
            ...loan,
            loaned_date: new Date(loan.loaned_date).toISOString().split('T')[0], 
            returned_date: loan.returned_date ? new Date(loan.returned_date).toISOString().split('T')[0] : '' 
        });
        setEditingLoanId(loan.id); 
    };

    return (
        <OuterContainer>
            <Container>
                <h1>{editingLoanId ? 'ערוך השאלה 📚' : 'הוסף השאלה חדשה 📚'}</h1>
                <form onSubmit={handleSubmit}>
                <Link to="/userhome">
                    <HomeButton>🏠 חזור לדף הבית</HomeButton>
                </Link>
                    <h2>ההשאלות וההחזרות שלי 📚</h2>
                    <InputGroup>
                        <label>
                            מזהה ספר 📖:
                            <Input 
                                type="number" 
                                name="book_id" 
                                value={loan.book_id} 
                                onChange={handleChange} 
                                required 
                            />
                        </label>
                    </InputGroup>
                    <InputGroup>
                        <p>מזהה משתמש 👤: {user.id}</p>
                    </InputGroup>
                    <InputGroup>
                        <label>
                            תאריך השאלה 📅:
                            <Input 
                                type="date" 
                                name="loaned_date" 
                                value={loan.loaned_date} 
                                onChange={handleChange} 
                                required 
                            />
                        </label>
                    </InputGroup>
                    <InputGroup>
                        <label>
                            תאריך החזרה 📅:
                            <Input 
                                type="date" 
                                name="returned_date" 
                                value={loan.returned_date} 
                                onChange={handleChange} 
                                required 
                            />
                        </label>
                    </InputGroup>
                    <InputGroup>
                        <label>
                            הוחזר ✅:
                            <Checkbox 
                                type="checkbox" 
                                name="returned" 
                                checked={loan.returned} 
                                onChange={handleChange} 
                            />
                        </label>
                    </InputGroup>
                    <Button type="submit">{editingLoanId ? 'עדכן השאלה ✏️' : 'הוסף השאלה ➕'}</Button>
                </form>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {loans.length === 0 && !error ? (
                    <NoLoansMessage>אין הלוואות זמינות</NoLoansMessage>
                ) : (
                    <LoansTable>
                        <thead>
                            <tr>
                                <TableHeader>📖 ספר</TableHeader>
                                <TableHeader>📅 תאריך השאלה</TableHeader>
                                <TableHeader>📅 תאריך החזרה</TableHeader>
                                <TableHeader>✅ הוחזר</TableHeader>
                                <TableHeader>⚙️ פעולות</TableHeader>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map((loan) => (
                                <TableRow key={loan.id}>
                                    <TableData>{loan.book_id}</TableData>
                                    <TableData>{new Date(loan.loaned_date).toLocaleDateString()}</TableData>
                                    <TableData>{loan.returned_date ? new Date(loan.returned_date).toLocaleDateString() : 'לא הוחזר'}</TableData>
                                    <TableData>{loan.returned ? 'כן' : '❗'}</TableData>
                                    <TableData>
                                        <Button onClick={() => handleEdit(loan)}>✏️ ערוך</Button>
                                    </TableData>
                                </TableRow>
                            ))}
                        </tbody>
                    </LoansTable>
                )}
               
            </Container>
        </OuterContainer>
    );
};

export default AddLoan;

// Styled Components
const OuterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
`;

const Container = styled.div`
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 1000px;
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

const Checkbox = styled.input`
    margin-top: 10px;
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

const LoansTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
`;

const TableHeader = styled.th`
    padding: 15px;
    background-color: #142e99;
    color: white;
    text-align: left;
`;

const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #bfe2ff;
    }
`;

const TableData = styled.td`
    padding: 15px;
    border: 1px solid #ddd;
`;

const NoLoansMessage = styled.p`
    text-align: center;
    color: #888;
`;

const ErrorMessage = styled.p`
    color: red;
    text-align: center;
`;
