import { PrismaClient } from '@prisma/client';
import { logger } from '../logging/logger';

export const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'info', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
});

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug('Query:', e.query);
    logger.debug('Params:', e.params);
    logger.debug('Duration:', e.duration + 'ms');
  });
}

export async function connectDatabase() {
  try {
    logger.info('🔌 Attempting database connection...');
    
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
    
    // Test the connection with a simple query
    logger.info('🧪 Testing database connection...');
    await prisma.$queryRaw`SELECT 1 as test`;
    logger.info('✅ Database query test successful');
    
    // Check if workers table exists and has data
    try {
      const workerCount = await prisma.worker.count();
      logger.info(`📊 Found ${workerCount} workers in database`);
      
      if (workerCount === 0) {
        logger.warn('⚠️  No workers found in database - you may need to add test data');
      }
    } catch (tableError) {
      logger.error('❌ Error accessing workers table:', tableError);
      logger.info('💡 You may need to run: npx prisma db push');
    }
    
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    logger.error('💡 Check your DATABASE_URL in .env file');
    logger.error('💡 Make sure Supabase project is running');
    throw error;
  }
}

export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    logger.info('✅ Database disconnected successfully');
  } catch (error) {
    logger.error('❌ Database disconnection failed:', error);
  }
}