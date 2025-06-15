import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';
import { RedisClient } from './config/redis';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';
import eventRoutes from './routes/events';
import friendRoutes from './routes/friends';
import flagRoutes from './routes/flags';
import notificationRoutes from './routes/notifications';
import uploadRoutes from './routes/upload';
import paymentRoutes from './routes/payments';
import moderatorRoutes from './routes/moderator';

// Socket handlers
import { setupSocketHandlers } from './sockets/socketHandlers';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
  }
});

// Initialize Prisma
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

// Initialize Redis
export const redis = new RedisClient();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) }
  }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/flags', flagRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/moderator', moderatorRoutes);

// Socket.IO setup
setupSocketHandlers(io);

// Store io instance globally for use in other modules
app.set('io', io);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  
  server.close(() => {
    logger.info('HTTP server closed.');
  });
  
  await prisma.$disconnect();
  await redis.disconnect();
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  
  server.close(() => {
    logger.info('HTTP server closed.');
  });
  
  await prisma.$disconnect();
  await redis.disconnect();
  
  process.exit(0);
});

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 ScoopSocials Backend Server running in ${NODE_ENV} mode on port ${PORT}`);
  logger.info(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  logger.info(`🔗 Backend URL: ${process.env.BACKEND_URL || `http://localhost:${PORT}`}`);
  
  if (NODE_ENV === 'development') {
    logger.info(`📊 Health check: http://localhost:${PORT}/health`);
    logger.info(`📚 API docs: http://localhost:${PORT}/api`);
  }
});

export { io };
export default app;