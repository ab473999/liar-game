const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Load environment variables
require('dotenv').config({ 
  path: path.resolve(__dirname, '.env')
});

// Debug: Log environment variables
console.log('🔍 Environment Check:');
console.log('  SLACK_BOT_TOKEN:', process.env.SLACK_BOT_TOKEN ? '✓ Set' : '✗ Not set');
console.log('  DEFAULT_CHANNEL_ID:', process.env.DEFAULT_CHANNEL_ID ? '✓ Set' : '✗ Not set');
console.log('  DEFAULT_CHANNEL_NAME:', process.env.DEFAULT_CHANNEL_NAME || 'Not set');
console.log('  IS_AUTH_ENABLED:', process.env.IS_AUTH_ENABLED === 'true' || process.env.IS_AUTH_ENABLED === 'True' || process.env.IS_AUTH_ENABLED === 'TRUE' ? '✓ Enabled' : '✗ Disabled');
console.log('  ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? '✓ Set' : '✗ Not set');

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'https://liar.nyc:5173',
    'https://liar.nyc',
    'https://www.liar.nyc',
    'http://liar.nyc',
    'http://www.liar.nyc'
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
