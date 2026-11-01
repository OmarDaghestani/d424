import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js'; // Ensure this points to the `routes/index.js` file
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import db from './config/connection.js';
import path from 'path';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Refusing to start.');
  process.exit(1);
}

await db();

const app = express();
const PORT = process.env.PORT || 5000;

// Behind Render / nginx: trust the first proxy so rate limiting sees real client IPs
app.set('trust proxy', 1);

// Comma-separated list of allowed frontend origins
const allowedOrigins = (process.env.CLIENT_URL || 'https://ecom.omar-daghestani.com')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(helmet());
app.use(
  cors({
    // Exact matches only; requests without an Origin header (curl, Stripe) are allowed
    origin: (origin, callback) =>
      callback(null, !origin || allowedOrigins.includes(origin)),
  })
);

// Stripe webhook needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '100kb' }));

// Throttle credential endpoints against brute force
app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many attempts, please try again later' },
  })
);

// Serve static files
const __dirname = path.resolve();
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Routes
app.use(routes); // Register routes from `routes/index.js`

// Error Handling Middleware
app.use(notFound); // Handle undefined routes
app.use(errorHandler); // Centralized error handling

// Start Server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});
