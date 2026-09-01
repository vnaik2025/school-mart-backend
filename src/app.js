import express from 'express';
import cors from 'cors';
import { requestId } from './middleware/request-id.js';
import { requestLogger } from './middleware/request-logger.js';
import { errorHandler } from './middleware/error-handler.js';
import apiRouter from './routes/index.js';

const app = express();

// Base Middlewares
app.use(cors({
  origin: ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Request ID and Logging Middlewares
app.use(requestId);
app.use(requestLogger);

// Mount main API router
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter); // Added to support frontend routes missing /v1

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Centralized Error Handler Middleware
app.use(errorHandler);

export default app;
