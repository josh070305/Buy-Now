(function () {
	require('dotenv').config();
	const express = require('express');
	const helmet = require('helmet');
	const cors = require('cors');
	const connectDB = require('./config/db');
	const productRoutes = require('./routes/product');
	const debugRoutes = require('./routes/debug');
	const healthRoutes = require('./routes/health');
	const userRoutes = require('./routes/user');
	const adminRoutes = require('./routes/admin');
	const orderRoutes = require('./routes/order');
	const { errorHandler, notFound } = require('./middleware/errorHandler');

	const app = express();
	const PORT = process.env.PORT || 5000;

	// Connect to MongoDB
	connectDB().then(async () => {
		// DEBUG: log environment flags for seeding
		console.log('DEBUG env:', { SEED_ON_START: process.env.SEED_ON_START, NODE_ENV: process.env.NODE_ENV });
		if (process.env.SEED_ON_START === 'true' && process.env.NODE_ENV !== 'production') {
			try {
				const seed = require('./seed');
				if (seed && seed.seedIntoExistingConnection) {
					await seed.seedIntoExistingConnection();
					console.log('Seeded database on startup');
				} else if (typeof seed === 'function') {
					// fallback
					await seed();
					console.log('Seed function executed on startup');
				}
			} catch (e) {
				console.error('Seed on start failed:', e.message || e);
			}
		}

		// Dev convenience: if DB is empty, auto-seed so frontend/dev uses sample data
		try {
			if (process.env.NODE_ENV !== 'production') {
				const Product = require('./models/Product');
				const productCount = await Product.countDocuments();
				if (productCount === 0) {
					console.log('DB appears empty — running dev auto-seed');
					const seed = require('./seed');
					if (seed && seed.seedIntoExistingConnection) {
						await seed.seedIntoExistingConnection();
						console.log('Auto-seed complete');
					} else if (typeof seed === 'function') {
						await seed();
						console.log('Auto-seed (fallback) complete');
					}
				}
			}
		} catch (autoErr) {
			console.error('Auto-seed failed:', autoErr && (autoErr.message || autoErr));
		}
	}).catch(err => {
		console.error('DB connection failed on backend startup:', err.message || err);
	});

	// Middleware
	app.use(helmet());
	if (process.env.NODE_ENV !== 'production') {
		console.log('Development mode: enabling permissive CORS for frontend');
		app.use(cors());
	} else {
		const allowedOrigin = process.env.FRONTEND_ORIGIN;
		app.use(cors({
			origin: (origin, callback) => {
				if (!origin) return callback(null, true);
				if (!allowedOrigin || allowedOrigin === '*' || origin === allowedOrigin || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
					return callback(null, true);
				}
				return callback(null, false);
			},
			credentials: true
		}));
	}
	app.use(express.json());

	// Routes
	app.use('/api/health', healthRoutes);
	app.use('/api/products', productRoutes);
	// Development-only debug routes
	if (process.env.NODE_ENV !== 'production') {
		app.use('/api/debug', debugRoutes);
	}
	app.use('/api/users', userRoutes);
	app.use('/admin', adminRoutes);
	app.use('/api/orders', orderRoutes);

	app.use(notFound);
	app.use(errorHandler);

	app.listen(PORT, () => {
		console.log('Backend server running on port ' + PORT);
	});
})();

