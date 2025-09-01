const prisma = require('../lib/prisma');

/**
 * Get all themes from the database
 * @param {boolean} easterEgg - Filter by easter egg status (optional)
 * @returns {Promise<Array>} Array of theme objects
 */
async function getThemes(easterEgg = null) {
  try {
    const whereClause = {};
    
    // Add easter egg filter if provided
    if (easterEgg !== null) {
      whereClause.easterEgg = easterEgg;
    }
    
    const themes = await prisma.theme.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    return themes;
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
    
    return theme;
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
    
    return theme;
  } catch (error) {
    console.error('Error fetching theme by type:', error);
    throw new Error('Failed to fetch theme from database');
  }
}

module.exports = {
  getThemes,
  getThemeById,
  getThemeByType
};
