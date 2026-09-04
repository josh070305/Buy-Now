require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/product');
const healthRoutes = require('./routes/health');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/order');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Optionally seed DB on server start (useful when using in-memory MongoDB)
if (process.env.SEED_ON_START === 'true' && process.env.NODE_ENV !== 'production') {
  try {
    // require the seed function and run it
    const seedData = require('./seed');
    seedData().catch(err => console.error('Seed on start error:', err));
  } catch (e) {
    console.error('Unable to run seed on start:', e.message);
  }
}

// Middleware
app.use(helmet());
// Configure CORS to allow only the frontend origin
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS: no origin, allowing');
      return callback(null, true);
    }
    if (origin === allowedOrigin) {
      console.log('CORS: origin matches allowed origin:', origin);
      return callback(null, true);
    }
    console.log('CORS: origin not allowed:', origin);
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
