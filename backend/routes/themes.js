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

/**
 * POST /api/themes
 * Create a new theme
 * Body parameters:
 * - type: string (required) - Theme type identifier
 * - nameKo: string (optional) - Korean name
 * - nameEn: string (required) - English name
 * - nameIt: string (optional) - Italian name
 * - easterEgg: boolean (optional) - Easter egg status, defaults to false
 */
router.post('/', async (req, res) => {
  try {
    const { type, nameKo, nameEn, nameIt, easterEgg = false } = req.body;
    
    // Validate required fields
    if (!type || !nameEn) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: type, nameEn'
      });
    }
    
    const theme = await themeService.createTheme({
      type,
      nameKo,
      nameEn,
      nameIt,
      easterEgg
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
 * - nameKo: string (optional) - Korean name
 * - nameEn: string (optional) - English name
 * - nameIt: string (optional) - Italian name
 * - easterEgg: boolean (optional) - Easter egg status
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nameKo, nameEn, nameIt, easterEgg } = req.body;
    
    // Validate that at least one field is provided
    if (!nameKo && !nameEn && !nameIt && easterEgg === undefined) {
      return res.status(400).json({
        success: false,
        error: 'At least one field must be provided for update'
      });
    }
    
    const updateData = {};
    if (nameKo !== undefined) updateData.nameKo = nameKo;
    if (nameEn !== undefined) updateData.nameEn = nameEn;
    if (nameIt !== undefined) updateData.nameIt = nameIt;
    if (easterEgg !== undefined) updateData.easterEgg = easterEgg;
    
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
