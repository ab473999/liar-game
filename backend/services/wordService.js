const prisma = require('../lib/prisma');

/**
 * Get words by theme type and language
 * @param {string} themeType - The theme type (e.g., 'food', 'place')
 * @param {string} language - The language code ('ko', 'en', 'it')
 * @returns {Promise<Array>} Array of word objects
 */
async function getWordsByTheme(themeType, language = 'en') {
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

    // Transform words based on language
    const transformedWords = words.map(word => {
      let wordText = word.wordEn || word.wordKo; // Default to English
      
      switch (language) {
        case 'en':
          wordText = word.wordEn || word.wordKo;
          break;
        case 'it':
          wordText = word.wordIt || word.wordKo;
          break;
        default:
          wordText = word.wordEn || word.wordKo; // Default to English
      }

      return {
        id: word.id,
        word: wordText,
        wordKo: word.wordKo,
        wordEn: word.wordEn,
        wordIt: word.wordIt,
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
    
    return word;
  } catch (error) {
    console.error('Error fetching word by ID:', error);
    throw new Error('Failed to fetch word from database');
  }
}

/**
 * Get random word from a theme
 * @param {string} themeType - The theme type
 * @param {string} language - The language code
 * @returns {Promise<Object|null>} Random word object or null if no words found
 */
async function getRandomWordByTheme(themeType, language = 'en') {
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

    // Transform word based on language
    let wordText = randomWord.wordEn || randomWord.wordKo; // Default to English
    
    switch (language) {
      case 'en':
        wordText = randomWord.wordEn || randomWord.wordKo;
        break;
      case 'it':
        wordText = randomWord.wordIt || randomWord.wordKo;
        break;
      default:
        wordText = randomWord.wordEn || randomWord.wordKo; // Default to English
    }

    return {
      id: randomWord.id,
      word: wordText,
      wordKo: randomWord.wordKo,
      wordEn: randomWord.wordEn,
      wordIt: randomWord.wordIt,
      themeId: randomWord.themeId
    };
  } catch (error) {
    console.error('Error fetching random word by theme:', error);
    throw new Error('Failed to fetch random word from database');
  }
}

module.exports = {
  getWordsByTheme,
  getWordById,
  getRandomWordByTheme
};
