import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Login endpoint
app.post('/workers/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    
    const { workerId, password } = req.body;
    
    if (!workerId || !password) {
      return res.status(400).json({ 
        error: 'Worker ID and password are required' 
      });
    }

    // Find worker in database
    const worker = await prisma.wORKERS.findUnique({
      where: { WORKER_ID: parseInt(workerId) }
    });

    console.log('Worker found:', worker ? 'Yes' : 'No');

    if (!worker) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Check if worker is active
    if (!worker.ACTIVE) {
      return res.status(401).json({ 
        error: 'Account is inactive' 
      });
    }

    // Simple password check (in production, use bcrypt)
    if (worker.PASSWORD !== password) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Return worker data (without password)
    const { PASSWORD, ...workerData } = worker;
    
    res.json({
      success: true,
      worker: workerData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});