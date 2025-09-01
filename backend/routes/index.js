const express = require('express');
const router = express.Router();

// Import route modules
const themesRouter = require('./themes');
const wordsRouter = require('./words');

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Liar Game API',
    version: '1.0.0',
    note: 'Routes and services to be implemented't
  });
});

// Mount route modules
router.use('/themes', themesRouter);
router.use('/words', wordsRouter);

module.exports = router;
