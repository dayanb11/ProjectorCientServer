import dotenv from 'dotenv';
import app from './app';
import { logger } from './infrastructure/logging/logger';
import { connectDatabase } from './infrastructure/startup/database';

// Load environment variables first
dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    logger.info('🚀 Starting PROJECTOR Backend Server...');
    logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
    logger.info(`🔗 CORS Origin: ${process.env.CORS_ORIGIN}`);
    
    // Connect to database
    logger.info('🔌 Connecting to database...');
    await connectDatabase();
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`✅ Server running successfully on port ${PORT}`);
      logger.info(`🌐 API available at: http://localhost:${PORT}`);
      logger.info(`❤️  Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
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

// Start the server
startServer().catch((error) => {
  logger.error('Startup error:', error);
  process.exit(1);
});