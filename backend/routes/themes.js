const express = require('express');
const router = express.Router();
const themeService = require('../services/themeService');

/**
 * GET /api/themes
 * Get all themes with optional easter egg filter
 * Query parameters:
 * - easterEgg: boolean (optional) - Filter by easter egg status
 */
router.get('/', async (req, res) => {
  try {
    const { easterEgg } = req.query;
    
    // Parse easterEgg parameter if provided
    let easterEggFilter = null;
    if (easterEgg !== undefined) {
      easterEggFilter = easterEgg === 'true';
    }
    
    const themes = await themeService.getThemes(easterEggFilter);
    
    res.json({
      success: true,
      data: themes,
      count: themes.length
    });
  } catch (error) {
    console.error('Error in themes route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/themes/:id
 * Get a single theme by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const theme = await themeService.getThemeById(id);
    
    if (!theme) {
      return res.status(404).json({
        success: false,
        error: 'Theme not found'
      });
    }
    
    res.json({
      success: true,
      data: theme
    });
  } catch (error) {
    console.error('Error in theme by ID route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/themes/type/:type
 * Get a single theme by type
 */
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    const theme = await themeService.getThemeByType(type);
    
    if (!theme) {
      return res.status(404).json({
        success: false,
        error: 'Theme not found'
      });
    }
    
    res.json({
      success: true,
      data: theme
    });
  } catch (error) {
    console.error('Error in theme by type route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;
