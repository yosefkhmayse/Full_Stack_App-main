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
    const { username, password, email, role = 'user' } = req.body; // Default role as 'user'
    console.log('Attempting to add user:', { username, email, role });

    // Check if the username already exists
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        }
        if (results.length > 0) {
            return res.status(409).json({ error: 'שם המשתמש כבר קיים' }); // Conflict error
        }

        // Hash the password
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ error: 'שגיאה בהצפנת הסיסמה' });
            }

            // Insert new user into the database
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
    });
};

// עדכון משתמש
export const editUser = (req, res) => {
    const { id } = req.params;
    const { username, password, email, role } = req.body;
    console.log('Updating user with ID:', id, { username, email, role });

    // Check if username already exists (excluding the current user)
    db.query('SELECT * FROM users WHERE username = ? AND id != ?', [username, id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        }
        if (results.length > 0) {
            return res.status(409).json({ error: 'שם המשתמש כבר קיים' }); // Conflict error
        }

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
// שינוי סיסמה
export const changePassword = (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Assuming the user ID is set in the req object (e.g., from middleware)

    console.log('Changing password for user ID:', userId);

    // Fetch the user to verify the current password
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        }
        if (results.length === 0) {
            console.log('User not found');
            return res.status(404).json({ error: 'משתמש לא נמצא' });
        }

        const user = results[0];

        // Compare the current password
        bcrypt.compare(currentPassword, user.password, (err, match) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
            }

            if (!match) {
                console.log('Current password is incorrect');
                return res.status(400).json({ error: 'סיסמה נוכחית שגויה' });
            }

            // Hash the new password and update it in the database
            bcrypt.hash(newPassword, saltRounds, (err, hashedNewPassword) => {
                if (err) {
                    console.error('Error hashing new password:', err);
                    return res.status(500).json({ error: 'שגיאה בהצפנת הסיסמה' });
                }

                db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId], (err) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
                    }
                    console.log('Password changed successfully');
                    res.json({ message: 'הסיסמה שונתה בהצלחה' });
                });
            });
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
