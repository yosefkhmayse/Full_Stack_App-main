import express from 'express';
import { bigAdminLogin, adminLogin, userLogin, userRegister } from '../controllers/authController.js';

const router = express.Router();

// מסלול כניסת BigAdmin
router.post('/bigadminlogin', bigAdminLogin);

// מסלול כניסת אדמין
router.post('/adminlogin', adminLogin);

// מסלול כניסת משתמש
router.post('/userlogin', userLogin);

// מסלול רישום משתמש
router.post('/userregister', userRegister);

export default router;
