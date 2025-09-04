const prisma = require('../lib/prisma');

/**
 * Get words by theme type
 * @param {string} themeType - The theme type (e.g., 'food', 'place')
 * @returns {Promise<Array>} Array of word objects
 */
async function getWordsByTheme(themeType) {
  try {
    // First get the theme by type
    const theme = await prisma.theme.findUnique({
      where: { type: themeType }
    });

    if (!theme) {
      throw new Error(`Theme '${themeType}' not found`);
    }

    // Get words for this theme
    const words = await prisma.word.findMany({
      where: { themeId: theme.id },
      orderBy: { createdAt: 'asc' }
    });

    // Transform words to return only English
    const transformedWords = words.map(word => {
      return {
        id: word.id,
        word: word.wordEn || '',
        themeId: word.themeId
      };
    });

    return transformedWords;
  } catch (error) {
    console.error('Error fetching words by theme:', error);
    throw new Error('Failed to fetch words from database');
  }
}

/**
 * Get a single word by ID
 * @param {number} id - Word ID
 * @returns {Promise<Object|null>} Word object or null if not found
 */
async function getWordById(id) {
  try {
    const word = await prisma.word.findUnique({
      where: { id: parseInt(id) },
      include: {
        theme: true
      }
    });
    
    if (!word) {
      return null;
    }
    
    // Return only English fields
    return {
      id: word.id,
      word: word.wordEn || '',
      themeId: word.themeId,
      theme: word.theme,
      archive: word.archive || []
    };
  } catch (error) {
    console.error('Error fetching word by ID:', error);
    throw new Error('Failed to fetch word from database');
  }
}

/**
 * Get random word from a theme
 * @param {string} themeType - The theme type
 * @returns {Promise<Object|null>} Random word object or null if no words found
 */
async function getRandomWordByTheme(themeType) {
  try {
    // First get the theme by type
    const theme = await prisma.theme.findUnique({
      where: { type: themeType }
    });

    if (!theme) {
      throw new Error(`Theme '${themeType}' not found`);
    }

    // Get a random word for this theme
    const words = await prisma.word.findMany({
      where: { themeId: theme.id }
    });

    if (words.length === 0) {
      return null;
    }

    // Select random word
    const randomWord = words[Math.floor(Math.random() * words.length)];

    return {
      id: randomWord.id,
      word: randomWord.wordEn || '',
      themeId: randomWord.themeId
    };
  } catch (error) {
    console.error('Error fetching random word by theme:', error);
    throw new Error('Failed to fetch random word from database');
  }
}

/**
 * Create a new word
 * @param {Object} wordData - Word data object
 * @param {number} wordData.themeId - Theme ID
 * @param {string} wordData.wordEn - English word
 * @returns {Promise<Object>} Created word object
 */
async function createWord(wordData) {
  try {
    const word = await prisma.word.create({
      data: wordData
    });
    
    // Return only English fields
    return {
      id: word.id,
      word: word.wordEn || '',
      themeId: word.themeId
    };
  } catch (error) {
    console.error('Error creating word:', error);
    throw new Error('Failed to create word in database');
  }
}

/**
 * Update a word by ID
 * @param {number} id - Word ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} Updated word object or null if not found
 */
async function updateWord(id, updateData) {
  try {
    // First, fetch the current word to save its state in archive
    const currentWord = await prisma.word.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!currentWord) {
      return null; // Word not found
    }
    
    // Prepare archive data
    const archiveEntry = {
      wordKo: currentWord.wordKo,
      wordEn: currentWord.wordEn,
      wordIt: currentWord.wordIt,
      updatedAt: currentWord.updatedAt,
      archivedAt: new Date()
    };
    
    // Get existing archive or create new array
    const existingArchive = currentWord.archive || [];
    const updatedArchive = [...existingArchive, archiveEntry];
    
    // Update the word with new data and updated archive
    const word = await prisma.word.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        archive: updatedArchive
      }
    });
    
    // Return only English fields
    return {
      id: word.id,
      word: word.wordEn || '',
      themeId: word.themeId,
      archive: word.archive
    };
  } catch (error) {
    console.error('Error updating word:', error);
    if (error.code === 'P2025') {
      return null; // Record not found
    }
    throw new Error('Failed to update word in database');
  }
}

/**
 * Delete a word by ID
 * @param {number} id - Word ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
async function deleteWord(id) {
  try {
    await prisma.word.delete({
      where: { id: parseInt(id) }
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting word:', error);
    if (error.code === 'P2025') {
      return false; // Record not found
    }
    throw new Error('Failed to delete word from database');
  }
}

module.exports = {
  getWordsByTheme,
  getWordById,
  getRandomWordByTheme,
  createWord,
  updateWord,
  deleteWord
};
