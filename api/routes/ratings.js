// routes/ratingsRouter.js
import express from 'express';
import { setRating, getRating } from '../controllers/ratingsController.js';

const router = express.Router();

// הגדרת דירוג
router.post('/', setRating); 
// קבלת הדירוג הממוצע לספר
router.get('/:id', getRating); 

export default router;
