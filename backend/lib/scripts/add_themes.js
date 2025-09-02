const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
require('dotenv').config();

// Import the theme service
const themeService = require('../../services/themeService');

/**
 * Convert theme name to type format (lowercase with dashes)
 * @param {string} name - Theme name
 * @returns {string} Type format
 */
function nameToType(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Add themes from YAML file to database
 */
async function addThemes() {
  try {
    console.log('Starting theme import...');
    
    // Read the YAML file
    const yamlPath = path.join(__dirname, 'themes.yml');
    const yamlContent = fs.readFileSync(yamlPath, 'utf8');
    
    // Parse YAML content
    const data = yaml.load(yamlContent);
    
    if (!data.themes || !Array.isArray(data.themes)) {
      throw new Error('Invalid YAML structure: themes array not found');
    }
    
    console.log(`Found ${data.themes.length} themes to import`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each theme
    for (const themeName of data.themes) {
      try {
        const type = nameToType(themeName);
        
        // Check if theme already exists
        const existingTheme = await themeService.getThemeByType(type);
        
        if (existingTheme) {
          console.log(`Theme "${themeName}" (${type}) already exists, skipping...`);
          continue;
        }
        
        // Create theme data
        const themeData = {
          type: type,
          nameEn: themeName
        };
        
        // Add theme to database
        const newTheme = await themeService.createTheme(themeData);
        
        console.log(`✓ Added theme: "${themeName}" (${type})`);
        successCount++;
        
      } catch (error) {
        console.error(`✗ Error adding theme "${themeName}":`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n=== Import Summary ===');
    console.log(`Successfully added: ${successCount} themes`);
    console.log(`Errors: ${errorCount} themes`);
    console.log(`Total processed: ${data.themes.length} themes`);
    
    if (errorCount > 0) {
      console.log('\nSome themes failed to import. Check the errors above.');
      process.exit(1);
    } else {
      console.log('\nAll themes imported successfully!');
    }
    
  } catch (error) {
    console.error('Fatal error during theme import:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  addThemes()
    .then(() => {
      console.log('Theme import completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Theme import failed:', error);
      process.exit(1);
    });
}

module.exports = { addThemes, nameToType };
