const prisma = require('../lib/prisma');

/**
 * Get all themes from the database
 * @returns {Promise<Array>} Array of theme objects
 */
async function getThemes() {
  try {
    const themes = await prisma.theme.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    // Transform to return only English fields
    return themes.map(theme => ({
      id: theme.id,
      type: theme.type,
      name: theme.nameEn || '',
      createdAt: theme.createdAt,
      updatedAt: theme.updatedAt
    }));
  } catch (error) {
    console.error('Error fetching themes:', error);
    throw new Error('Failed to fetch themes from database');
  }
}

/**
 * Get a single theme by ID
 * @param {number} id - Theme ID
 * @returns {Promise<Object|null>} Theme object or null if not found
 */
async function getThemeById(id) {
  try {
    const theme = await prisma.theme.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!theme) {
      return null;
    }
    
    // Return only English fields
    return {
      id: theme.id,
      type: theme.type,
      name: theme.nameEn || '',
      createdAt: theme.createdAt,
      updatedAt: theme.updatedAt
    };
  } catch (error) {
    console.error('Error fetching theme by ID:', error);
    throw new Error('Failed to fetch theme from database');
  }
}

/**
 * Get a theme by type
 * @param {string} type - Theme type
 * @returns {Promise<Object|null>} Theme object or null if not found
 */
async function getThemeByType(type) {
  try {
    const theme = await prisma.theme.findUnique({
      where: { type }
    });
    
    if (!theme) {
      return null;
    }
    
    // Return only English fields
    return {
      id: theme.id,
      type: theme.type,
      name: theme.nameEn || '',
      createdAt: theme.createdAt,
      updatedAt: theme.updatedAt
    };
  } catch (error) {
    console.error('Error fetching theme by type:', error);
    throw new Error('Failed to fetch theme from database');
  }
}

/**
 * Create a new theme
 * @param {Object} themeData - Theme data object
 * @param {string} themeData.type - Theme type identifier
 * @param {string} themeData.nameEn - English name
 * @returns {Promise<Object>} Created theme object
 */
async function createTheme(themeData) {
  try {
    const theme = await prisma.theme.create({
      data: themeData
    });
    
    // Return only type and English fields
    return {
      id: theme.id,
      type: theme.type,
      name: theme.nameEn || '',
      createdAt: theme.createdAt,
      updatedAt: theme.updatedAt
    };
  } catch (error) {
    console.error('Error creating theme:', error);
    throw new Error('Failed to create theme in database');
  }
}

/**
 * Update a theme by ID
 * @param {number} id - Theme ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} Updated theme object or null if not found
 */
async function updateTheme(id, updateData) {
  try {
    const theme = await prisma.theme.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    
    // Return only English fields
    return {
      id: theme.id,
      type: theme.type,
      name: theme.nameEn || '',
      createdAt: theme.createdAt,
      updatedAt: theme.updatedAt
    };
  } catch (error) {
    console.error('Error updating theme:', error);
    if (error.code === 'P2025') {
      return null; // Record not found
    }
    throw new Error('Failed to update theme in database');
  }
}

/**
 * Get word count for a theme
 * @param {number} id - Theme ID
 * @returns {Promise<number>} Number of words for the theme
 */
async function getWordCount(id) {
  try {
    const count = await prisma.word.count({
      where: { themeId: parseInt(id) }
    });
    
    return count;
  } catch (error) {
    console.error('Error getting word count for theme:', error);
    throw new Error('Failed to get word count from database');
  }
}

module.exports = {
  getThemes,
  getThemeById,
  getThemeByType,
  createTheme,
  updateTheme,
  getWordCount
};
