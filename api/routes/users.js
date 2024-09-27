import express from 'express';
import { getUsers, getUserById, addUser, editUser, deleteUser, changePassword, getUserDetails } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authenticate.js';

const router = express.Router();

// Route to get all users
router.get('/', getUsers);

// Route to get user by ID
router.get('/:id', getUserById);

// Route to add a new user
router.post('/', addUser);

// Route to edit an existing user
router.put('/:id', editUser);

// Route to change user password (requires authentication)
router.post('/change-password', authenticateToken, changePassword);

// Route to get user details (requires authentication)
router.get('/getUserDetails', authenticateToken, (req, res) => {
  console.log('User details:', { username: req.user.username, id: req.user.id });
  res.json({
    message: 'User details retrieved successfully',
    username: req.user.username,
    id: req.user.id
  });
});

// Route to delete user by ID
router.delete('/:id', deleteUser);

export default router;
