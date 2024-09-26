import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // השתמש במשתנה סביבה עבור הסוד

// קבלת כל המשתמשים
export const getUsers = (req, res) => {
    console.log('Fetching all users');
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        }
        console.log('Users fetched:', results);
        res.json(results);
    });
};

// קבלת משתמש לפי מזהה
export const getUserById = (req, res) => {
    const { id } = req.params;
    console.log('Fetching user with ID:', id);
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        }
        if (results.length === 0) {
            console.log('User not found');
            return res.status(404).json({ error: 'משתמש לא נמצא' });
        }
        console.log('User fetched:', results[0]);
        res.json(results[0]);
    });
};

// הוספת משתמש חדש
export const addUser = (req, res) => {
    const { username, password, email, role } = req.body;
    console.log('Adding user:', { username, email, role });

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ error: 'שגיאה בהצפנת הסיסמה' });
        }

        db.query('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', 
        [username, hashedPassword, email, role], 
        (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
            }
            console.log('User added successfully');
            res.status(201).json({ message: 'המשתמש נוסף' });
        });
    });
};

// עדכון משתמש
export const editUser = (req, res) => {
    const { id } = req.params;
    const { username, password, email, role } = req.body;
    console.log('Updating user with ID:', id, { username, email, role });

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ error: 'שגיאה בהצפנת הסיסמה' });
        }

        db.query('UPDATE users SET username = ?, password = ?, email = ?, role = ? WHERE id = ?', 
        [username, hashedPassword, email, role, id], 
        (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
            }
            console.log('User updated successfully');
            res.json({ message: 'המשתמש עודכן' });
        });
    });
};

// מחיקת משתמש
export const deleteUser = (req, res) => {
    const { id } = req.params;
    console.log('Deleting user with ID:', id);
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        }
        console.log('User deleted successfully');
        res.status(204).send();
    });
};

// כניסת משתמש
export const login = (req, res) => {
    const { username, password } = req.body;
    console.log('User login attempt:', { username });

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        }
        if (results.length === 0) {
            console.log('Invalid username or password');
            return res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
            }

            if (match) {
                const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
                console.log('Login successful, token generated');
                res.json({ message: 'התחברת בהצלחה', token });
            } else {
                console.log('Invalid username or password');
                res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' });
            }
        });
    });
};

// קבלת פרטי משתמש
export const getUserDetails = (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log('Getting user details with token:', token);

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Invalid token:', err);
            return res.status(403).json({ error: 'Invalid token' });
        }

        db.query('SELECT username FROM users WHERE id = ?', [decoded.id], (err, results) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({ error: 'Database query error' });
            }
            if (results.length === 0) {
                console.log('User not found');
                return res.status(404).json({ error: 'User not found' });
            }

            console.log('User details retrieved:', { username: results[0].username, id: decoded.id });
            res.json({ username: results[0].username, id: decoded.id });
        });
    });
};
