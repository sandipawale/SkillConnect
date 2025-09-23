import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import colors from 'colors';
import session from 'express-session';
import passport from 'passport';
import rateLimit from 'express-rate-limit';

import configurePassport from './config/passport.js';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Pre-load all models
import './models/User.js';
import './models/Course.js';
import './models/Category.js';
import './models/Lesson.js';
import './models/Enrollment.js';
import './models/Quiz.js';
import './models/Question.js';
import './models/QuizAttempt.js';
import './models/Assignment.js';
import './models/AssignmentSubmission.js';

// Import route files
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import courseRoutes from './routes/courses.js';
import categoryRoutes from './routes/categories.js';
import enrollmentRoutes from './routes/enrollments.js';
import uploadRoutes from './routes/upload.js';
import quizRoutes from './routes/quizRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import { nestedLessonRouter, singleLessonRouter } from './routes/lessons.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
console.log('✅ CLOUDINARY:', {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
});


configurePassport(passport);
connectDB();
const app = express();
app.set('trust proxy', 1);


// --- THIS IS THE GUARANTEED FIX: CORS Configuration for Production ---
// We create a whitelist of allowed origins.
const whitelist = [
  'http://localhost:5173',
  'https://skill-connect-gamma.vercel.app' 
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or if the origin is in our whitelist.
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// --- END OF GUARANTEED FIX ---

app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200, // Increased limit slightly
});
app.use('/api', limiter);

// Mount API routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/lessons', singleLessonRouter);
app.use('/api/upload', uploadRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/assignments', assignmentRoutes);

// For production, the backend doesn't need to serve static files anymore
// as Vercel is handling the frontend.
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});