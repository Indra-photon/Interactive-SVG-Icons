

import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

// Add connection promise to prevent race conditions
let connectionPromise: Promise<void> | null = null;

async function dbConnect(): Promise<void> {
    // If already connected, return immediately
    if (connection.isConnected) {
        console.log('Already connected to the database');
        return;
    }

    // If connection is in progress, wait for it
    if (connectionPromise) {
        console.log('Connection already in progress, waiting...');
        return connectionPromise;
    }

    // Start new connection
    connectionPromise = connectWithRetry();
    
    try {
        await connectionPromise;
    } finally {
        connectionPromise = null;
    }
}

async function connectWithRetry(retries = 3, delay = 2000): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const db = await mongoose.connect(process.env.MONGODB_URI as string || '', {
                serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
                socketTimeoutMS: 45000,
            });
            
            connection.isConnected = db.connections[0].readyState;
            console.log(`Database connection established (attempt ${attempt})`);
            return;

        } catch (error) {
            console.error(`Database connection attempt ${attempt} failed:`, error);
            
            if (attempt === retries) {
                console.error('All database connection attempts failed');
                throw new Error('Failed to connect to database after multiple attempts');
            }
            
            // Wait before retrying
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

export default dbConnect;