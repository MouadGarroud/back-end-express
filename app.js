import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

// Configurations & Middlewares
import { corsConfig } from './config/cors.config.js';
import { morganConfig } from './config/morgan.config.js';
import { helmetMiddleware } from './config/helmet.config.js';
import notFound from './middlewares/notFound.middleware.js';
import errorHandler from './errors/errorHandler.error.js';
import protect from './middlewares/auth.middleware.js';

// Rate Limiting Import
import { globalRateLimit } from './middlewares/rateLimit.middleware.js';

// Routers
import authRouter from './routes/auth.router.js';
import advRouter from './routes/advance.router.js';

const app = express();

// Security optimizations
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Global Middlewares
app.use(cookieParser());
app.use(helmetMiddleware);
app.use(cors(corsConfig));
app.use(morgan(morganConfig));

// Body parser with Multipart handling exemption
app.use((req, res, next) => {
  const isMultipart = req.headers['content-type']?.startsWith('multipart/form-data');
  if (!isMultipart) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

// Apply Global Rate Limiting to all incoming traffic
app.use(globalRateLimit);

// --- Application Routes ---
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/adv', protect, advRouter);

// --- Error Boundaries ---
app.use(notFound);
app.use(errorHandler);

export default app;
