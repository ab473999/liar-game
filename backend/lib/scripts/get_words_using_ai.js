const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const https = require('https');
require('dotenv').config();

// Import the theme service to get theme information
const themeService = require('../../services/themeService');

/**
 * Get all themes that have no words
 * @returns {Promise<Array>} Array of theme objects with no words
 */
async function getEmptyThemes() {
  try {
    const themes = await themeService.getThemes();
    const emptyThemes = [];
    
    for (const theme of themes) {
      const wordCount = await themeService.getWordCount(theme.id);
      if (wordCount === 0) {
        emptyThemes.push(theme);
      }
    }
    
    return emptyThemes;
  } catch (error) {
    console.error('Error getting empty themes:', error);
    throw error;
  }
}

/**
 * Make HTTP request to OpenAI API
 * @param {string} apiKey - OpenAI API key
 * @param {Object} data - Request data
 * @returns {Promise<Object>} Response data
 */
function makeOpenAIRequest(apiKey, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/responses',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${apiKey}`
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            reject(new Error(`API Error: ${res.statusCode} - ${parsedData.error?.message || responseData}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Generate words for a theme using OpenAI API
 * @param {string} themeType - Theme type (e.g., 'food', 'place')
 * @returns {Promise<Array>} Array of word objects
 */
async function generateWordsForTheme(themeType) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  // Get theme information from database
  const theme = await themeService.getThemeByType(themeType);
  if (!theme) {
    throw new Error(`Theme '${themeType}' not found in database`);
  }

  const themeName = theme.nameEn || theme.type;

  const requestData = {
    model: "gpt-5",
    input: [
      {
        role: "system",
        content: `You are a word generation assistant. Generate exactly 20 words for the theme "${themeName}". Each word must be 1-3 words long maximum. Return the words in a structured format.`
      },
      {
        role: "user", 
        content: `Generate 20 words for the theme "${themeName}". Each word must be 1-3 words long maximum. Make sure the words are relevant to the theme and appropriate for a word game.`
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "word_list",
        schema: {
          type: "object",
          properties: {
            words: {
              type: "array",
              items: {
                type: "string",
                description: "English word (1-3 words max)"
              },
              minItems: 20,
              maxItems: 20
            }
          },
          required: ["words"],
          additionalProperties: false
        },
        strict: true
      }
    },
    max_output_tokens: 2000
  };

      try {
      console.log(`🤖 Generating words for theme: ${themeName} (${themeType})...`);
      
      const response = await makeOpenAIRequest(apiKey, requestData);
      
      if (response.status === 'completed' && response.output && response.output.length > 0) {
        // Find the message item (not reasoning)
        const messageItem = response.output.find(item => item.type === 'message');
        if (!messageItem || !messageItem.content || messageItem.content.length === 0) {
          console.error('❌ No message content found in response');
          console.error('Available items:', response.output.map(item => item.type));
          throw new Error('No message content found in response');
        }
        
        const content = messageItem.content[0];
        
        if (content.type === 'output_text') {
          try {
            const parsedWords = JSON.parse(content.text);
            console.log(`✅ Generated ${parsedWords.words.length} words for ${themeName}`);
            return parsedWords.words;
          } catch (parseError) {
            console.error('❌ Parse error details:');
            console.error('Raw response text:', content.text);
            console.error('Parse error:', parseError.message);
            throw new Error(`Failed to parse AI response: ${parseError.message}`);
          }
        } else if (content.type === 'refusal') {
          console.error('❌ AI refused to generate words:');
          console.error('Refusal reason:', content.refusal);
          throw new Error(`AI refused to generate words: ${content.refusal}`);
        } else {
          console.error('❌ Unexpected response type:');
          console.error('Response content:', JSON.stringify(content, null, 2));
          throw new Error(`Unexpected response type: ${content.type}`);
        }
      } else {
        console.error('❌ Incomplete response details:');
        console.error('Response status:', response.status);
        console.error('Response output:', JSON.stringify(response.output, null, 2));
        console.error('Full response:', JSON.stringify(response, null, 2));
        throw new Error(`Incomplete response: ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Error generating words for ${themeName}:`, error.message);
      if (error.message.includes('API Error:')) {
        console.error('Full API error response:', error.message);
      }
      throw error;
    }
}

/**
 * Save words to individual YAML file (for single theme generation)
 * @param {string} themeType - Theme type
 * @param {string} themeName - Theme name
 * @param {Array} words - Array of word objects
 */
function saveWordsToYAML(themeType, themeName, words) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${timestamp}.yml`;
  const filepath = path.join(__dirname, 'words', filename);
  
  const yamlData = {
    theme: {
      type: themeType,
      name: themeName,
      generated_at: new Date().toISOString(),
      word_count: words.length
    },
    words: words
  };
  
  try {
    fs.writeFileSync(filepath, yaml.dump(yamlData, { 
      indent: 2,
      lineWidth: 120,
      noRefs: true
    }));
    
    console.log(`💾 Saved words to: ${filepath}`);
    return filepath;
  } catch (error) {
    throw new Error(`Failed to save YAML file: ${error.message}`);
  }
}

/**
 * Save words to a single YAML file (for bulk generation)
 * @param {Array} results - Array of result objects with theme and words
 */
function saveAllWordsToSingleYAML(results) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `bulk_generation_${timestamp}.yml`;
  const filepath = path.join(__dirname, 'words', filename);
  
  const yamlData = {
    generated_at: new Date().toISOString(),
    total_themes: results.length,
    successful_themes: results.filter(r => r.success).length,
    failed_themes: results.filter(r => !r.success).length,
    themes: results.map(result => ({
      type: result.theme.type,
      name: result.theme.nameEn,
      success: result.success,
      word_count: result.success ? result.words.length : 0,
      error: result.success ? null : result.error,
      words: result.success ? result.words : null
    }))
  };
  
  try {
    fs.writeFileSync(filepath, yaml.dump(yamlData, { 
      indent: 2,
      lineWidth: 120,
      noRefs: true
    }));
    
    console.log(`💾 Saved all results to: ${filepath}`);
    return filepath;
  } catch (error) {
    throw new Error(`Failed to save bulk YAML file: ${error.message}`);
  }
}

/**
 * Initialize bulk YAML file
 * @returns {string} Filepath of the created file
 */
function initializeBulkYAML() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `bulk_generation_${timestamp}.yml`;
  const filepath = path.join(__dirname, 'words', filename);
  
  const initialData = {
    generated_at: new Date().toISOString(),
    total_themes: 0,
    successful_themes: 0,
    failed_themes: 0,
    themes: []
  };
  
  try {
    fs.writeFileSync(filepath, yaml.dump(initialData, { 
      indent: 2,
      lineWidth: 120,
      noRefs: true
    }));
    
    console.log(`📁 Created bulk file: ${filepath}`);
    return filepath;
  } catch (error) {
    throw new Error(`Failed to create bulk YAML file: ${error.message}`);
  }
}

/**
 * Append a theme result to the bulk YAML file
 * @param {string} filepath - Path to the YAML file
 * @param {Object} result - Result object with theme and words/error
 */
function appendToBulkYAML(filepath, result) {
  try {
    // Read existing data
    const existingData = yaml.load(fs.readFileSync(filepath, 'utf8'));
    
    // Add the new result
    existingData.themes.push({
      type: result.theme.type,
      name: result.theme.nameEn,
      success: result.success,
      word_count: result.success ? result.words.length : 0,
      error: result.success ? null : result.error,
      words: result.success ? result.words : null
    });
    
    // Update counts
    existingData.total_themes = existingData.themes.length;
    existingData.successful_themes = existingData.themes.filter(t => t.success).length;
    existingData.failed_themes = existingData.themes.filter(t => !t.success).length;
    
    // Write back to file
    fs.writeFileSync(filepath, yaml.dump(existingData, { 
      indent: 2,
      lineWidth: 120,
      noRefs: true
    }));
    
    console.log(`💾 Appended ${result.theme.nameEn} to bulk file`);
  } catch (error) {
    console.error(`❌ Failed to append to bulk file: ${error.message}`);
  }
}

/**
 * Main function to generate words for all empty themes
 */
async function generateWordsForAllEmptyThemes() {
  try {
    console.log('🎯 Starting word generation for all empty themes...');
    console.log('─'.repeat(60));
    
    // Get all themes with no words
    const emptyThemes = await getEmptyThemes();
    
    if (emptyThemes.length === 0) {
      console.log('✅ All themes already have words!');
      return;
    }
    
    console.log(`📊 Found ${emptyThemes.length} themes with no words:`);
    emptyThemes.forEach((theme, index) => {
      console.log(`   ${index + 1}. ${theme.nameEn} (${theme.type})`);
    });
    
    console.log('\n🚀 Starting word generation...\n');
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    // Initialize bulk YAML file
    const bulkFilepath = initializeBulkYAML();
    
    // Process each theme
    for (let i = 0; i < emptyThemes.length; i++) {
      const theme = emptyThemes[i];
      console.log(`\n📝 Processing ${i + 1}/${emptyThemes.length}: ${theme.nameEn} (${theme.type})`);
      
      try {
        const words = await generateWordsForTheme(theme.type);
        
        // Create result object
        const result = {
          theme: theme,
          words: words,
          success: true
        };
        
        // Append to bulk YAML file immediately
        appendToBulkYAML(bulkFilepath, result);
        
        results.push(result);
        successCount++;
        console.log(`✅ Successfully generated ${words.length} words for "${theme.nameEn}"`);
        
        // Add a small delay between requests to be respectful to the API
        if (i < emptyThemes.length - 1) {
          console.log('⏳ Waiting 3 seconds before next request...');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
      } catch (error) {
        console.error(`❌ Failed to generate words for "${theme.nameEn}":`, error.message);
        
        // Create result object for failed theme
        const result = {
          theme: theme,
          error: error.message,
          success: false
        };
        
        // Append to bulk YAML file immediately
        appendToBulkYAML(bulkFilepath, result);
        
        results.push(result);
        errorCount++;
        
        // Continue with next theme even if this one failed
        console.log(`⏭️  Continuing with next theme...`);
        
        // Add a small delay before continuing
        if (i < emptyThemes.length - 1) {
          console.log('⏳ Waiting 3 seconds before next request...');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    }
    
    // Summary
    console.log('\n' + '─'.repeat(60));
    console.log('📈 GENERATION SUMMARY');
    console.log('─'.repeat(60));
    console.log(`✅ Successful: ${successCount} themes`);
    console.log(`❌ Failed: ${errorCount} themes`);
    console.log(`📊 Total processed: ${emptyThemes.length} themes`);
    
    if (successCount > 0) {
      console.log('\n📁 Generated files:');
      console.log(`   • ${bulkFilepath}`);
    }
    
    if (errorCount > 0) {
      console.log('\n❌ Failed themes:');
      results.filter(r => !r.success).forEach(result => {
        console.log(`   • ${result.theme.nameEn} (${result.theme.type}): ${result.error}`);
      });
      
      console.log('\n💡 You can retry failed themes individually:');
      results.filter(r => !r.success).forEach(result => {
        console.log(`   node get_words_using_ai.js ${result.theme.type}`);
      });
    }
    
    console.log('\n🎉 All themes processed! Check the generated YAML files for review.');
    
    return results;
    
  } catch (error) {
    console.error('💥 Word generation failed:', error.message);
    throw error;
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // No arguments - generate for all empty themes
    console.log('🚀 Generating words for all empty themes...');
    generateWordsForAllEmptyThemes()
      .then(() => {
        console.log('\n✨ Word generation completed!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\n💥 Word generation failed:', error.message);
        process.exit(1);
      });
  } else if (args.length === 1) {
    // Single argument - generate for specific theme
    const themeType = args[0];
    console.log(`🎯 Generating words for specific theme: ${themeType}`);
    
    generateWordsForTheme(themeType)
      .then(async (words) => {
        const theme = await themeService.getThemeByType(themeType);
        const themeName = theme.nameEn || theme.type;
        const filepath = saveWordsToYAML(themeType, themeName, words);
        
        console.log('─'.repeat(60));
        console.log(`🎉 Successfully generated ${words.length} words for "${themeName}"`);
        console.log(`📁 File saved: ${filepath}`);
        
        // Show sample words
        console.log('\n📝 Sample words:');
        words.slice(0, 5).forEach((word, index) => {
          console.log(`   ${index + 1}. ${word}`);
        });
        
        if (words.length > 5) {
          console.log(`   ... and ${words.length - 5} more words`);
        }
        
        console.log('\n✨ Word generation completed!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\n💥 Word generation failed:', error.message);
        process.exit(1);
      });
  } else {
    console.log('Usage:');
    console.log('  node get_words_using_ai.js                    # Generate for all empty themes');
    console.log('  node get_words_using_ai.js <theme_type>      # Generate for specific theme');
    console.log('');
    console.log('Examples:');
    console.log('  node get_words_using_ai.js                    # Generate for all empty themes');
    console.log('  node get_words_using_ai.js food               # Generate for food theme');
    console.log('  node get_words_using_ai.js jobs               # Generate for jobs theme');
    process.exit(1);
  }
}

module.exports = { generateWordsForTheme, generateWordsForAllEmptyThemes, saveWordsToYAML, saveAllWordsToSingleYAML, initializeBulkYAML, appendToBulkYAML, getEmptyThemes };
