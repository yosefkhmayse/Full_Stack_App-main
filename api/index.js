import express from 'express';
import userRoutes from './routes/users.js';
import bookRoutes from './routes/books.js';
import adminRoutes from './routes/admins.js';
import ratingsRoutes from './routes/ratings.js';
import loanRoutes from './routes/loans.js';
import categoryRoutes from './routes/categories.js';
import booksForCategoriesRoutes from './routes/booksForCategories.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js'; // התאם את הנתיב אם יש צורך

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // החלף עם כתובת ה-URL של צד הלקוח שלך
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// קביעת __dirname עבור מודולי ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// הגשת קבצים סטטיים מהתיקייה "public"
app.use('/public', express.static(path.join(__dirname, 'public')));

// נתיבי API
app.use('/api/admins', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/books-for-categories', booksForCategoriesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ratings', ratingsRoutes);

// הפעלת השרת
db.connect((err) => {
  if (err) {
    console.error('החיבור למסד הנתונים נכשל:', err.stack);
    return;
  }
  console.log('Connected to the database.');
  app.listen(8800, () => {
    console.log('Server is running on port 8800');
  });
});
