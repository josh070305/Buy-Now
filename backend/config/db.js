const mongoose = require('mongoose');

const connectDB = async () => {
  const envUri = process.env.MONGODB_URI;
  const localUri = process.env.MONGODB_LOCAL || 'mongodb://localhost:27017/buy_now_db';

  const tryConnect = async (uri, label) => {
    try {
      const conn = await mongoose.connect(uri, { connectTimeoutMS: 10000 });
      console.log(`${label} MongoDB Connected: ${conn.connection.host || uri}`);
      return conn;
    } catch (err) {
      console.error(`${label} MongoDB connection error:`, err.message || err);
      throw err;
    }
  };

  // 1) Try explicit MONGODB_URI (Atlas or provided)
  if (envUri) {
    try {
      return await tryConnect(envUri, 'Remote');
    } catch (err) {
      console.error('Remote DB connect failed, will try local and/or in-memory');
    }
  }

  // 2) Try local MongoDB (developer convenience)
  if (process.env.NODE_ENV !== 'production') {
    try {
      return await tryConnect(localUri, 'Local');
    } catch (err) {
      console.error('Local DB connect failed, will fall back to in-memory');
    }
  }

  // 3) Fallback to in-memory MongoDB for development/testing
  try {
    console.log('Falling back to in-memory MongoDB (development)');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    const conn = await mongoose.connect(memUri);
    console.log('Connected to in-memory MongoDB');
    return conn;
  } catch (memErr) {
    console.error('Failed to start in-memory MongoDB:', memErr);
    process.exit(1);
  }
};

module.exports = connectDB;
