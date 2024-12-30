import express, { Request, Response, NextFunction } from 'express';
import payload from 'payload';
import next from 'next';
import dotenv from 'dotenv';
import payloadConfig from './payload.config';
import { MongoClient } from 'mongodb';

// Load environment variables
dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const mongoOptions = {
  connectTimeoutMS: 60000, // 1 minute
  socketTimeoutMS: 60000,  // 1 minute
  retryWrites: true,
  retryReads: true,
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 60000,    // 1 minute
  serverSelectionTimeoutMS: 60000, // 1 minute
};

const start = async () => {
  try {
    await app.prepare();
    const server = express();

    // Add raw body parsing for Payload
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    // Test MongoDB connection before initializing Payload
    const mongoURL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crypto-portfolio';
    try {
      console.log('Testing MongoDB connection...');
      const client = await MongoClient.connect(mongoURL, mongoOptions);
      await client.db().command({ ping: 1 });
      await client.close();
      console.log('MongoDB connection successful');
    } catch (mongoError) {
      console.error('MongoDB connection error:', mongoError);
      throw new Error('Failed to connect to MongoDB');
    }

    // Initialize Payload with error handling
    try {
      console.log('Initializing Payload...');
      await payload.init({
        secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
        mongoURL,
        express: server,
        config: payloadConfig,
        onInit: () => {
          console.log('Payload initialized successfully');
        },
        mongoOptions,
      });
      console.log('Payload initialization complete');
    } catch (payloadError) {
      console.error('Failed to initialize Payload:', payloadError);
      throw payloadError;
    }

    // Add error handling middleware
    server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Express error:', err);
      res.status(500).json({ error: 'Internal server error', details: err.message });
    });

    // Handle Next.js API routes first
    server.use('/api/users/register', (req: Request, res: Response, next: NextFunction) => {
      console.log('Register route hit:', req.method, req.url);
      return handle(req, res);
    });

    server.use('/api/users/login', (req: Request, res: Response, next: NextFunction) => {
      console.log('Login route hit:', req.method, req.url);
      return handle(req, res);
    });

    // Handle Payload admin routes
    server.use('/admin', (req: Request, res: Response) => handle(req, res));

    // Handle all other routes with Next.js
    server.all('*', (req: Request, res: Response) => {
      console.log('Route hit:', req.method, req.url);
      return handle(req, res);
    });

    // Start the server
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`Next.js App URL: http://localhost:${port}`);
      console.log(`Payload Admin URL: http://localhost:${port}/admin`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
};

start();
