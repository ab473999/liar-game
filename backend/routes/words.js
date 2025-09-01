const express = require('express');
const router = express.Router();
const wordService = require('../services/wordService');

/**
 * GET /api/words
 * Get words by theme and language
 * Query parameters:
 * - theme: string (required) - Theme type (e.g., 'food', 'place')
 * - lang: string (optional) - Language code ('ko', 'en', 'it'), defaults to 'ko'
 */
router.get('/', async (req, res) => {
  try {
    const { theme, lang = 'ko' } = req.query;
    
    if (!theme) {
      return res.status(400).json({
        success: false,
        error: 'Theme parameter is required'
      });
    }

    const words = await wordService.getWordsByTheme(theme, lang);
    
    res.json({
      success: true,
      data: words,
      count: words.length,
      theme: theme,
      language: lang
    });
  } catch (error) {
    console.error('Error in words route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/words/random
 * Get a random word from a theme
 * Query parameters:
 * - theme: string (required) - Theme type
 * - lang: string (optional) - Language code, defaults to 'ko'
 */
router.get('/random', async (req, res) => {
  try {
    const { theme, lang = 'ko' } = req.query;
    
    if (!theme) {
      return res.status(400).json({
        success: false,
        error: 'Theme parameter is required'
      });
    }

    const word = await wordService.getRandomWordByTheme(theme, lang);
    
    if (!word) {
      return res.status(404).json({
        success: false,
        error: 'No words found for this theme'
      });
    }

    res.json({
      success: true,
      data: word,
      theme: theme,
      language: lang
    });
  } catch (error) {
    console.error('Error in random word route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/words/:id
 * Get a single word by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const word = await wordService.getWordById(id);
    
    if (!word) {
      return res.status(404).json({
        success: false,
        error: 'Word not found'
      });
    }
    
    res.json({
      success: true,
      data: word
    });
  } catch (error) {
    console.error('Error in word by ID route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;
