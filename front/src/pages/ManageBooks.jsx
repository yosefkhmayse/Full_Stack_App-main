import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('/books');
                setBooks(response.data);
            } catch (err) {
                setError('נכשל בהבאת הספרים');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/books/${id}`);
            setBooks(books.filter(book => book.id !== id));
        } catch (err) {
            setError('נכשל במחיקת הספר');
        }
    };

    if (loading) return <p>טוען...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <nav>
                <ul>
                    <li><Link to="/admin/home">דף הבית</Link></li>
                    <li><Link to="/admin/books">נהל ספרים</Link></li>
                    <li><Link to="/admin/users">נהל משתמשים</Link></li>
                    <li><Link to="/admin/admins">נהל מנהלים</Link></li>
                    <li><Link to="/admin/categories">נהל קטגוריות</Link></li>
                    <li><Link to="/admin/loans">נהל הלוואות</Link></li>
                    <li><Link to="/admin/books-for-categories">נהל ספרים לקטגוריות</Link></li>
                </ul>
            </nav>
            <h1>נהל ספרים</h1>
            <Link to="/admin/add-book">הוסף ספר חדש</Link>
            <table>
                <thead>
                    <tr>
                        <th>כותרת</th>
                        <th>מחבר</th>
                        <th>זמין</th>
                        <th>שנת פרסום</th>
                        <th>ז'אנר</th>
                        <th>דירוג</th>
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.available ? 'כן' : 'לא'}</td>
                            <td>{book.publication_year}</td>
                            <td>{book.genre}</td>
                            <td>{book.rating}</td>
                            <td>
                                <Link to={`/admin/edit-book/${book.id}`}>ערוך</Link>
                                <button onClick={() => handleDelete(book.id)}>מחק</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageBooks;
