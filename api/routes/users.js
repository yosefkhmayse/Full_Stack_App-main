import express from 'express';
import { getUsers, getUserById, addUser, editUser, deleteUser, getUserDetails } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authenticate.js';

const router = express.Router();

// מסלול לקבלת כל המשתמשים
router.get('/', getUsers);

// מסלול לקבלת משתמש לפי מזהה
router.get('/:id', getUserById);

// מסלול להוספת משתמש חדש
router.post('/', addUser);

// מסלול לעריכת משתמש קיים
router.put('/:id', editUser);

// מסלול לקבלת פרטי משתמש (דורש אימות)
router.get('/getUserDetails', authenticateToken, (req, res) => {
  console.log('פרטי המשתמש:', { username: req.user.username, id: req.user.id });
  res.json({
    message: 'פרטי המשתמש התקבלו בהצלחה',
    username: req.user.username,
    id: req.user.id
  });
});

// מסלול למחיקת משתמש לפי מזהה
router.delete('/:id', deleteUser);

export default router;
