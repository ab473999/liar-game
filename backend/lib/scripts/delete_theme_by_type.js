require('dotenv').config();
const prisma = require('../prisma');

/**
 * Delete a theme by its type
 * Usage: node delete_theme_by_type.js <theme-type>
 * Example: node delete_theme_by_type.js places
 */
async function deleteThemeByType(type) {
  try {
    // Find the theme by type
    const theme = await prisma.theme.findUnique({
      where: { type: type }
    });
    
    if (!theme) {
      console.log(`Theme with type "${type}" not found.`);
      return false;
    }
    
    console.log(`Found theme: "${theme.nameEn}" (type: ${theme.type}, id: ${theme.id})`);
    
    // Count associated words
    const wordCount = await prisma.word.count({
      where: { themeId: theme.id }
    });
    
    if (wordCount > 0) {
      console.log(`Warning: This theme has ${wordCount} associated words that will also be deleted.`);
    }
    
    // Delete the theme (cascade will delete associated words)
    await prisma.theme.delete({
      where: { id: theme.id }
    });
    
    console.log(`✓ Successfully deleted theme "${theme.nameEn}" (type: ${theme.type})`);
    if (wordCount > 0) {
      console.log(`  Also deleted ${wordCount} associated words.`);
    }
    
    return true;
    
  } catch (error) {
    console.error('Error deleting theme:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  const themeType = process.argv[2];
  
  if (!themeType) {
    console.log('Usage: node delete_theme_by_type.js <theme-type>');
    console.log('Example: node delete_theme_by_type.js places');
    process.exit(1);
  }
  
  console.log(`Attempting to delete theme with type: "${themeType}"`);
  
  const success = await deleteThemeByType(themeType);
  process.exit(success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { deleteThemeByType };
