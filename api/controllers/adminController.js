import bcrypt from 'bcrypt';
import { db } from '../db.js';

const saltRounds = 10; // הגדרת מספר סיבובי המלח

// קבלת כל המנהלים
export const getAdmins = (req, res) => {
    db.query('SELECT * FROM admins', (err, results) => {
        if (err) {
            console.error('שגיאת מסד נתונים:', err);
            return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        }
        res.json(results);
    });
};

// הוספת מנהל חדש
export const addAdmin = (req, res) => {
    const { username, password, email, role } = req.body;

    // בדיקת קיום שם משתמש או אימייל
    db.query('SELECT * FROM admins WHERE username = ? OR email = ?', [username, email], (err, results) => {
        if (err) {
            console.error('שגיאת מסד נתונים:', err);
            return res.status(500).json({ message: 'שגיאה בבסיס הנתונים' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'שם משתמש או אימייל קיימים כבר' });
        }

        // הצפנת הסיסמה לפני שמירתה
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                console.error('שגיאת הצפנה:', err);
                return res.status(500).json({ message: 'שגיאה בהצפנת הסיסמה' });
            }

            db.query('INSERT INTO admins (username, password, email, role) VALUES (?, ?, ?, ?)', 
                [username, hashedPassword, email, role], 
                (err) => {
                    if (err) {
                        console.error('שגיאת מסד נתונים:', err);
                        return res.status(500).json({ message: 'שגיאה בבסיס הנתונים' });
                    }
                    res.status(201).json({ message: 'מנהל נוסף' });
                }
            );
        });
    });
};

// עריכת מנהל
export const editAdmin = (req, res) => {
    const { id } = req.params;
    const { username, password, email, role } = req.body;

    // בדיקת קיום שם משתמש או אימייל (למעט המנהל הנוכחי שמתעדכן)
    db.query('SELECT * FROM admins WHERE (username = ? OR email = ?) AND id != ?', [username, email , id], (err, results) => {
        if (err) {
            console.error('שגיאת מסד נתונים:', err);
            return res.status(500).json({ message: 'שגיאה בבסיס הנתונים' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'שם משתמש או אימייל קיימים כבר' });
        }

        // פונקציה לעדכון פרטי המנהל
        const updateAdmin = (hashedPassword = null) => {
            const updateFields = [username, email, role, id];
            let query = 'UPDATE admins SET username = ?, email = ?, role = ? WHERE id = ?';

            if (hashedPassword) {
                // עדכון סיסמה אם ניתנה סיסמה מוצפנת
                query = 'UPDATE admins SET username = ?, password = ?, email = ?, role = ? WHERE id = ?';
                updateFields.splice(1, 0, hashedPassword); // הוספת הסיסמה המוצפנת למערך הערכים
            }

            db.query(query, updateFields, (err) => {
                if (err) {
                    console.error('שגיאת מסד נתונים:', err);
                    return res.status(500).json({ message: 'שגיאה בבסיס הנתונים' });
                }
                res.json({ message: 'מנהל עודכן' });
            });
        };

        if (password) {
            // הצפנת הסיסמה אם ניתנה סיסמה
            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    console.error('שגיאת הצפנה:', err);
                    return res.status(500).json({ message: 'שגיאה בהצפנת הסיסמה' });
                }
                updateAdmin(hashedPassword);
            });
        } else {
            updateAdmin(); // עדכון ללא שינוי סיסמה
        }
    });
};

// מחיקת מנהל
export const deleteAdmin = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM admins WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('שגיאת מסד נתונים:', err);
            return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        }
        res.json({ message: 'מנהל נמחק' });
    });
};

// קבלת מנהל לפי מזהה
export const getAdminById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT id, username, email, role FROM admins WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('שגיאת מסד נתונים:', err);
            return res.status(500).json({ error: 'שגיאה בבסיס הנתונים' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'מנהל לא נמצא' });
        }
        res.json(results[0]);
    });
};