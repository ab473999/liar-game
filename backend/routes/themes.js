const express = require('express');
const router = express.Router();
const themeService = require('../services/themeService');

/**
 * GET /api/themes
 * Get all themes
 */
router.get('/', async (req, res) => {
  try {
    const themes = await themeService.getThemes();
    
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

/**
 * POST /api/themes
 * Create a new theme
 * Body parameters:
 * - type: string (required) - Theme type identifier
 * - name: string (required) - English name
 */
router.post('/', async (req, res) => {
  try {
    const { type, name } = req.body;
    
    // Validate required fields
    if (!type || !name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: type and name'
      });
    }
    
    const theme = await themeService.createTheme({
      type,
      nameEn: name
    });
    
    res.status(201).json({
      success: true,
      data: theme
    });
  } catch (error) {
    console.error('Error in create theme route:', error);
    if (error.message.includes('Unique constraint')) {
      return res.status(409).json({
        success: false,
        error: 'Theme type already exists'
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
 * PUT /api/themes/:id
 * Update a theme by ID
 * Body parameters:
 * - name: string (required) - English name
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    // Validate that name field is provided
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name field is required for update'
      });
    }
    
    const updateData = {
      nameEn: name
    };
    
    const theme = await themeService.updateTheme(id, updateData);
    
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
    console.error('Error in update theme route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;
