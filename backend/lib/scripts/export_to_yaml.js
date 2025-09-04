const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
require('dotenv').config();
const prisma = require('../prisma');

/**
 * Export all themes and words from database to YAML file
 * The YAML structure will be clean and easy to edit manually
 */
async function exportToYAML(filename = null) {
  try {
    console.log('🎯 Starting database export...\n');
    
    // Get all themes with their words
    const themes = await prisma.theme.findMany({
      include: {
        words: {
          orderBy: {
            wordEn: 'asc'
          }
        }
      },
      orderBy: {
        type: 'asc'
      }
    });
    
    console.log(`📊 Found ${themes.length} themes in database`);
    
    // Transform data to clean YAML structure
    const yamlData = {
      metadata: {
        exported_at: new Date().toISOString(),
        total_themes: themes.length,
        total_words: themes.reduce((sum, theme) => sum + theme.words.length, 0),
        version: '1.0'
      },
      themes: themes.map(theme => ({
        type: theme.type,
        name: theme.nameEn || '',
        words: theme.words.map(word => word.wordEn || '').filter(w => w) // Filter out empty words
      }))
    };
    
    // Generate filename if not provided
    if (!filename) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      filename = `themes_export_${timestamp}.yml`;
    }
    
    // Ensure it has .yml or .yaml extension
    if (!filename.endsWith('.yml') && !filename.endsWith('.yaml')) {
      filename += '.yml';
    }
    
    const filepath = path.join(__dirname, 'data', filename);
    
    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write YAML file with nice formatting
    const yamlContent = yaml.dump(yamlData, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      sortKeys: false, // Preserve our order
      quotingType: '"',
      forceQuotes: false
    });
    
    fs.writeFileSync(filepath, yamlContent);
    
    // Print summary
    console.log('\n' + '═'.repeat(60));
    console.log('📈 EXPORT SUMMARY');
    console.log('═'.repeat(60));
    
    let totalWords = 0;
    themes.forEach(theme => {
      const wordCount = theme.words.length;
      totalWords += wordCount;
      const status = wordCount > 0 ? '✅' : '⚠️';
      console.log(`${status} ${theme.type.padEnd(20)} | ${theme.nameEn?.padEnd(25) || 'No name'.padEnd(25)} | ${wordCount.toString().padStart(3)} words`);
    });
    
    console.log('─'.repeat(60));
    console.log(`📊 Total: ${themes.length} themes, ${totalWords} words`);
    console.log(`💾 Saved to: ${filepath}`);
    console.log('\n✨ Export completed successfully!');
    console.log('📝 You can now edit this file and use import_from_yaml.js to sync changes back');
    
    return filepath;
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Command line interface
if (require.main === module) {
  const filename = process.argv[2];
  
  console.log('🚀 Exporting database to YAML...');
  if (filename) {
    console.log(`📁 Output file: ${filename}`);
  } else {
    console.log('📁 Output file: auto-generated with timestamp');
  }
  console.log('─'.repeat(60));
  
  exportToYAML(filename)
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Fatal error:', error.message);
      process.exit(1);
    });
} else {
  console.log('Usage:');
  console.log('  node export_to_yaml.js                  # Export with auto-generated filename');
  console.log('  node export_to_yaml.js my_themes.yml    # Export to specific filename');
  console.log('');
  console.log('The file will be saved in the data/ subdirectory');
}

module.exports = { exportToYAML };
