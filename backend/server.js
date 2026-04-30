import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index.js'; // Ensure this points to the `routes/index.js` file
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import db from './config/connection.js';
import path from 'path';

dotenv.config();

await db();

const app = express();
const PORT = process.env.PORT || 5000;

// Stripe webhook needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
const __dirname = path.resolve();
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use(routes); // Register routes from `routes/index.js`

// Error Handling Middleware
app.use(notFound); // Handle undefined routes
app.use(errorHandler); // Centralized error handling

// Start Server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});
