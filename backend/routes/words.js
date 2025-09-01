const express = require('express');
const router = express.Router();
const wordService = require('../services/wordService');

/**
 * GET /api/words
 * Get words by theme and language
 * Query parameters:
 * - theme: string (required) - Theme type (e.g., 'food', 'place')
 * - lang: string (optional) - Language code ('ko', 'en', 'it'), defaults to 'en'
 */
router.get('/', async (req, res) => {
  try {
    const { theme, lang = 'en' } = req.query;
    
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
 * - lang: string (optional) - Language code, defaults to 'en'
 */
router.get('/random', async (req, res) => {
  try {
    const { theme, lang = 'en' } = req.query;
    
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

/**
 * POST /api/words
 * Create a new word
 * Body parameters:
 * - themeId: number (required) - Theme ID
 * - wordKo: string (optional) - Korean word
 * - wordEn: string (optional) - English word
 * - wordIt: string (optional) - Italian word
 */
router.post('/', async (req, res) => {
  try {
    const { themeId, wordKo, wordEn, wordIt } = req.body;
    
    // Validate required fields
    if (!themeId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: themeId'
      });
    }
    
    // Validate that at least one word field is provided
    if (!wordKo && !wordEn && !wordIt) {
      return res.status(400).json({
        success: false,
        error: 'At least one word field must be provided: wordKo, wordEn, or wordIt'
      });
    }
    
    const word = await wordService.createWord({
      themeId: parseInt(themeId),
      wordKo,
      wordEn,
      wordIt
    });
    
    res.status(201).json({
      success: true,
      data: word
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
 * Update a word by ID
 * Body parameters:
 * - wordKo: string (optional) - Korean word
 * - wordEn: string (optional) - English word
 * - wordIt: string (optional) - Italian word
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { wordKo, wordEn, wordIt } = req.body;
    
    // Validate that at least one field is provided
    if (!wordKo && !wordEn && !wordIt) {
      return res.status(400).json({
        success: false,
        error: 'At least one field must be provided for update'
      });
    }
    
    const updateData = {};
    if (wordKo !== undefined) updateData.wordKo = wordKo;
    if (wordEn !== undefined) updateData.wordEn = wordEn;
    if (wordIt !== undefined) updateData.wordIt = wordIt;
    
    const word = await wordService.updateWord(id, updateData);
    
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
 * Delete a word by ID
 */
router.delete('/:id', async (req, res) => {
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
