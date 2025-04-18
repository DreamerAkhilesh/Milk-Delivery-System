import mongoose from "mongoose" ;

import dotenv from 'dotenv';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

// This dbConnect has the job to establish the connection between the databse and the application 
const connectDB = async () => {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not defined in environment variables');
        }

        console.log('Attempting to connect to MongoDB Atlas...');
        console.log('Environment:', process.env.NODE_ENV);

        const options = {
            // Remove deprecated options
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            // Atlas specific optimizations
            maxPoolSize: 10,
            minPoolSize: 5,
            connectTimeoutMS: 10000,
            heartbeatFrequencyMS: 10000,
            maxIdleTimeMS: 30000,
            // Specify database name
            dbName: 'milk_delivery'
        };

        const conn = await mongoose.connect(process.env.DATABASE_URL, options);

        console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
        console.log(`Connection URL: ${process.env.DATABASE_URL}`);

        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to Atlas');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose Atlas connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected from Atlas');
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('Mongoose Atlas connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error(`Atlas connection error: ${error.message}`);
        console.error('Full error:', error);
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
}

export default connectDB ;
