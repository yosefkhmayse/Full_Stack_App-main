import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key-here'; // ודא שזה הסוד הנכון

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'אין גישה, יש להתחבר תחילה' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'הטוקן אינו תקין' });
        }
        req.user = user;
        next();
    });
};
