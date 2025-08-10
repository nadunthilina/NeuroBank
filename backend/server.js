const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

dotenv.config();
const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// JSON body parsing
app.use(express.json());

// Security & logging
app.use(helmet());
app.use(morgan('dev'));
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Basic route
app.get('/', (req, res) => {
  res.send('NeuroBank API running...');
});

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), ts: Date.now() });
});

// Test API endpoint for frontend connection
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Connection to NeuroBank API successful!',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/activities', require('./src/routes/activities'));
app.use('/api/user', require('./src/routes/user'));
app.use('/api/predict', require('./src/routes/predict'));
app.use('/api/alerts', require('./src/routes/alerts'));
app.use('/api/recommendations', require('./src/routes/recommendations'));
app.use('/api/plans', require('./src/routes/plans'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/analytics', require('./src/routes/analytics'));

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// MongoDB connect
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.warn('⚠️  MONGO_URI not set. Please configure .env');
}

mongoose.connect(mongoUri, { dbName: process.env.MONGO_DB || undefined })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('Mongo connection error:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
