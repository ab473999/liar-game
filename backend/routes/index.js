const express = require('express');
const router = express.Router();

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Liar Game API',
    version: '1.0.0',
    note: 'Routes and services to be implemented'
  });
});

module.exports = router;
