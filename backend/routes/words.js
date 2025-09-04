const express = require('express');
const router = express.Router();
const wordService = require('../services/wordService');
const { requireAuth } = require('../middleware/auth');

/**
 * GET /api/words
 * Get words by theme
 * Query parameters:
 * - theme: string (required) - Theme type (e.g., 'food', 'place')
 */
router.get('/', async (req, res) => {
  try {
    const { theme } = req.query;
    
    if (!theme) {
      return res.status(400).json({
        success: false,
        error: 'Theme parameter is required'
      });
    }

    const words = await wordService.getWordsByTheme(theme);
    
    res.json({
      success: true,
      data: words,
      count: words.length,
      theme: theme
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
 */
router.get('/random', async (req, res) => {
  try {
    const { theme } = req.query;
    
    if (!theme) {
      return res.status(400).json({
        success: false,
        error: 'Theme parameter is required'
      });
    }

    const word = await wordService.getRandomWordByTheme(theme);
    
    if (!word) {
      return res.status(404).json({
        success: false,
        error: 'No words found for this theme'
      });
    }

    res.json({
      success: true,
      data: word,
      theme: theme
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

/**
 * POST /api/words
 * Create a new word (requires authentication)
 * Body parameters:
 * - themeId: number (required) - Theme ID
 * - word: string (required) - English word
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { themeId, word } = req.body;
    
    // Validate required fields
    if (!themeId || !word) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: themeId and word'
      });
    }
    
    const newWord = await wordService.createWord({
      themeId: parseInt(themeId),
      wordEn: word
    });
    
    res.status(201).json({
      success: true,
      data: newWord
    });
  } catch (error) {
    console.error('Error in create word route:', error);
    if (error.message.includes('Foreign key constraint')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid theme ID'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * PUT /api/words/:id
 * Update a word by ID (requires authentication)
 * Body parameters:
 * - word: string (required) - English word
 */
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { word } = req.body;
    
    // Validate that word field is provided
    if (!word) {
      return res.status(400).json({
        success: false,
        error: 'Word field is required for update'
      });
    }
    
    const updateData = {
      wordEn: word
    };
    
    const updatedWord = await wordService.updateWord(id, updateData);
    
    if (!updatedWord) {
      return res.status(404).json({
        success: false,
        error: 'Word not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedWord
    });
  } catch (error) {
    console.error('Error in update word route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * DELETE /api/words/:id
 * Delete a word by ID (requires authentication)
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await wordService.deleteWord(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Word not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Word deleted successfully'
    });
  } catch (error) {
    console.error('Error in delete word route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;
