import dotenv from 'dotenv';
import app from './app';
import { logger } from './infrastructure/logging/logger';
import { connectDatabase } from './infrastructure/startup/database';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Connect to database
    await connectDatabase();
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 CORS Origin: ${process.env.CORS_ORIGIN}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();