const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
require('dotenv').config();
const prisma = require('../prisma');

/**
 * Import/sync themes and words from YAML file to database
 * Supports different sync modes for flexibility
 */
async function importFromYAML(filename, options = {}) {
  const {
    mode = 'merge', // 'merge' (default), 'replace', or 'addonly'
    dryRun = false, // If true, only simulate changes
    verbose = false // Show detailed output
  } = options;
  
  try {
    console.log('🎯 Starting YAML import...');
    console.log(`📁 File: ${filename}`);
    console.log(`⚙️  Mode: ${mode}`);
    if (dryRun) console.log('🔍 DRY RUN MODE - No changes will be made');
    console.log('─'.repeat(60));
    
    // Read YAML file
    let filepath;
    if (path.isAbsolute(filename)) {
      filepath = filename;
    } else if (filename.startsWith('data/')) {
      // If already includes data/ prefix, join from scripts directory
      filepath = path.join(__dirname, filename);
    } else {
      // Otherwise assume it's just the filename in data/ directory
      filepath = path.join(__dirname, 'data', filename);
    }
    
    if (!fs.existsSync(filepath)) {
      throw new Error(`File not found: ${filepath}`);
    }
    
    const fileContent = fs.readFileSync(filepath, 'utf8');
    const yamlData = yaml.load(fileContent);
    
    if (!yamlData.themes || !Array.isArray(yamlData.themes)) {
      throw new Error('Invalid YAML structure: missing themes array');
    }
    
    console.log(`\n📊 Found ${yamlData.themes.length} themes in YAML file`);
    
    // Statistics
    const stats = {
      themesCreated: 0,
      themesUpdated: 0,
      themesDeleted: 0,
      wordsCreated: 0,
      wordsUpdated: 0,
      wordsDeleted: 0,
      errors: []
    };
    
    // Get existing themes from database
    const existingThemes = await prisma.theme.findMany({
      include: {
        words: true
      }
    });
    
    const existingThemeMap = new Map(
      existingThemes.map(theme => [theme.type, theme])
    );
    
    // Process each theme from YAML
    for (const yamlTheme of yamlData.themes) {
      if (!yamlTheme.type) {
        stats.errors.push(`Theme missing type field`);
        continue;
      }
      
      console.log(`\n📝 Processing theme: ${yamlTheme.type}`);
      
      try {
        const existingTheme = existingThemeMap.get(yamlTheme.type);
        let theme;
        
        if (!existingTheme) {
          // Create new theme
          if (mode === 'replace') {
            if (verbose) console.log(`   ⏭️  Skipping new theme in replace mode: ${yamlTheme.type}`);
            continue;
          }
          
          console.log(`   ✨ Creating new theme: ${yamlTheme.type}`);
          if (!dryRun) {
            theme = await prisma.theme.create({
              data: {
                type: yamlTheme.type,
                nameEn: yamlTheme.name || yamlTheme.type
              }
            });
          } else {
            theme = { id: -1, type: yamlTheme.type }; // Fake theme for dry run
          }
          stats.themesCreated++;
        } else {
          // Update existing theme
          theme = existingTheme;
          
          // Check if name needs update
          if (yamlTheme.name && yamlTheme.name !== existingTheme.nameEn) {
            console.log(`   📝 Updating theme name: ${existingTheme.nameEn} → ${yamlTheme.name}`);
            if (!dryRun) {
              theme = await prisma.theme.update({
                where: { id: existingTheme.id },
                data: { nameEn: yamlTheme.name }
              });
            }
            stats.themesUpdated++;
          }
          
          // Mark as processed (for deletion check later)
          existingThemeMap.delete(yamlTheme.type);
        }
        
        // Process words for this theme
        if (yamlTheme.words && Array.isArray(yamlTheme.words)) {
          const yamlWords = yamlTheme.words.filter(w => w); // Filter out empty strings
          
          if (verbose) console.log(`   📚 Processing ${yamlWords.length} words`);
          
          // Get existing words for this theme
          const existingWords = existingTheme ? existingTheme.words : [];
          const existingWordMap = new Map(
            existingWords.map(word => [word.wordEn, word])
          );
          
          // Add/update words from YAML
          for (const yamlWord of yamlWords) {
            const existingWord = existingWordMap.get(yamlWord);
            
            if (!existingWord) {
              // Add new word
              if (verbose) console.log(`      + Adding word: ${yamlWord}`);
              if (!dryRun) {
                await prisma.word.create({
                  data: {
                    wordEn: yamlWord,
                    themeId: theme.id
                  }
                });
              }
              stats.wordsCreated++;
            } else {
              // Word already exists, mark as processed
              existingWordMap.delete(yamlWord);
            }
          }
          
          // Handle words that exist in DB but not in YAML
          if (mode === 'replace' || mode === 'merge') {
            for (const [wordText, word] of existingWordMap) {
              if (mode === 'replace') {
                // Delete words not in YAML
                if (verbose) console.log(`      - Removing word: ${wordText}`);
                if (!dryRun) {
                  await prisma.word.delete({
                    where: { id: word.id }
                  });
                }
                stats.wordsDeleted++;
              } else if (mode === 'merge') {
                // In merge mode, keep existing words
                if (verbose) console.log(`      ○ Keeping existing word: ${wordText}`);
              }
            }
          }
        }
        
      } catch (error) {
        console.error(`   ❌ Error processing theme ${yamlTheme.type}: ${error.message}`);
        stats.errors.push(`Theme ${yamlTheme.type}: ${error.message}`);
      }
    }
    
    // Handle themes that exist in DB but not in YAML (only in replace mode)
    if (mode === 'replace' && existingThemeMap.size > 0) {
      for (const [themeType, theme] of existingThemeMap) {
        console.log(`\n🗑️  Deleting theme not in YAML: ${themeType}`);
        if (!dryRun) {
          await prisma.theme.delete({
            where: { id: theme.id }
          });
        }
        stats.themesDeleted++;
        stats.wordsDeleted += theme.words.length;
      }
    }
    
    // Print summary
    console.log('\n' + '═'.repeat(60));
    console.log('📈 IMPORT SUMMARY');
    console.log('═'.repeat(60));
    
    if (stats.themesCreated > 0) console.log(`✨ Themes created: ${stats.themesCreated}`);
    if (stats.themesUpdated > 0) console.log(`📝 Themes updated: ${stats.themesUpdated}`);
    if (stats.themesDeleted > 0) console.log(`🗑️  Themes deleted: ${stats.themesDeleted}`);
    if (stats.wordsCreated > 0) console.log(`✨ Words created: ${stats.wordsCreated}`);
    if (stats.wordsUpdated > 0) console.log(`📝 Words updated: ${stats.wordsUpdated}`);
    if (stats.wordsDeleted > 0) console.log(`🗑️  Words deleted: ${stats.wordsDeleted}`);
    
    if (stats.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      stats.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    if (dryRun) {
      console.log('\n🔍 DRY RUN COMPLETE - No actual changes were made');
      console.log('💡 Run without --dry-run flag to apply changes');
    } else {
      console.log('\n✅ Import completed successfully!');
    }
    
    // Final database state
    if (!dryRun) {
      const finalThemes = await prisma.theme.findMany({
        include: {
          _count: {
            select: { words: true }
          }
        }
      });
      
      const totalWords = finalThemes.reduce((sum, theme) => sum + theme._count.words, 0);
      console.log(`\n📊 Database now contains: ${finalThemes.length} themes, ${totalWords} words`);
    }
    
    return stats;
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  // Parse arguments
  let filename = null;
  let mode = 'merge';
  let dryRun = false;
  let verbose = false;
  
  for (const arg of args) {
    if (arg === '--replace') {
      mode = 'replace';
    } else if (arg === '--merge') {
      mode = 'merge';
    } else if (arg === '--add-only') {
      mode = 'addonly';
    } else if (arg === '--dry-run') {
      dryRun = true;
    } else if (arg === '--verbose' || arg === '-v') {
      verbose = true;
    } else if (arg.startsWith('--')) {
      console.error(`Unknown option: ${arg}`);
      process.exit(1);
    } else {
      filename = arg;
    }
  }
  
  if (!filename) {
    console.log('Usage: node import_from_yaml.js <filename> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --merge      (default) Add new items, update existing, keep items not in YAML');
    console.log('  --replace    Replace all data with YAML content (deletes items not in YAML)');
    console.log('  --add-only   Only add new items, don\'t update or delete existing');
    console.log('  --dry-run    Simulate import without making changes');
    console.log('  --verbose    Show detailed output');
    console.log('');
    console.log('Examples:');
    console.log('  node import_from_yaml.js themes_export_2024-01-15.yml');
    console.log('  node import_from_yaml.js my_themes.yml --dry-run');
    console.log('  node import_from_yaml.js themes.yml --replace');
    console.log('  node import_from_yaml.js new_words.yml --add-only --verbose');
    process.exit(1);
  }
  
  console.log('🚀 Starting YAML import to database...');
  
  importFromYAML(filename, { mode, dryRun, verbose })
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Fatal error:', error.message);
      process.exit(1);
    });
}

module.exports = { importFromYAML };
