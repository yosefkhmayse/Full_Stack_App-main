import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const JWT_SECRET = 'your-secret-key-here';

const createToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

// התחברות מנהל ראשי
export const bigAdminLogin = async (req, res) => {
    const { username, password } = req.body;
    console.log('ניסיון התחברות מנהל ראשי:', { username });

    if (!username || !password) {
        return res.status(400).json({ error: 'שם משתמש וסיסמה נדרשים' });
    }

    if (username === 'yosef' && password === 'yosef') {
        const token = createToken({ id: 1, role: 'bigadmin' });
        console.log('התחברות מנהל ראשי הצליחה:', { id: 1, username });
        return res.json({ token });
    } else {
        return res.status(401).json({ error: 'שם משתמש או סיסמה לא נכונים' });
    }
};

// התחברות מנהל
export const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    console.log('ניסיון התחברות מנהל:', { username });

    if (!username || !password) {
        return res.status(400).json({ error: 'שם משתמש וסיסמה נדרשים' });
    }

    try {
        db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
            if (err) return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
            if (results.length === 0) return res.status(404).json({ error: 'מנהל לא נמצא' });

            const admin = results[0];
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) return res.status(401).json({ error: 'סיסמה לא נכונה' });

            const token = createToken({ id: admin.id, role: 'admin' });
            console.log('התחברות מנהל הצליחה:', { id: admin.id, username: admin.username });
            res.json({ token });
        });
    } catch (error) {
        res.status(500).json({ error: 'שגיאה בשרת' });
    }
};

// התחברות משתמש
export const userLogin = async (req, res) => {
    const { username, password } = req.body;
    console.log('ניסיון התחברות משתמש:', { username });

    if (!username || !password) {
        return res.status(400).json({ error: 'שם משתמש וסיסמה נדרשים' });
    }

    try {
        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (results.length === 0) return res.status(404).json({ error: 'משתמש לא נמצא' });
            if (err) {
                console.error('שגיאה בשאילתת מסד נתונים:', err.message);
                return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ error: 'סיסמה לא נכונה' });

            const token = createToken({ id: user.id, role: 'user' });
            console.log('התחברות משתמש הצליחה:', { id: user.id, username: user.username });
            res.json({ token });
        });
    } catch (error) {
        console.error('שגיאת שרת:', error.message);
        res.status(500).json({ error: 'שגיאה בשרת' });
    }
};

// רישום משתמש
export const userRegister = async (req, res) => {
    const { username, password, email } = req.body;
    console.log('ניסיון רישום משתמש:', { username, email });

    if (!username || !password || !email) {
        return res.status(400).json({ error: 'שם משתמש, סיסמה וכתובת דוא"ל נדרשים' });
    }

    try {
        // Check if the username already exists
        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (err) {
                console.error('שגיאה בבסיס הנתונים:', err);
                return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
            }

            if (results.length > 0) {
                return res.status(409).json({ error: 'שם המשתמש כבר קיים' }); // Conflict error
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user into the database
            db.query('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', 
                [username, hashedPassword, email, 'user'], 
                (err) => {
                    if (err) {
                        console.error('שגיאה בבסיס הנתונים בעת הוספת משתמש:', err);
                        return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
                    }
                    console.log('רישום משתמש הצליח');
                    res.status(201).json({ message: 'המשתמש נרשם בהצלחה' });
                }
            );
        });
    } catch (error) {
        console.error('שגיאה בשרת:', error);
        res.status(500).json({ error: 'שגיאה בשרת' });
    }
};

